package server

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"techlab/backend-go/internal/auth"
	"techlab/backend-go/internal/diagnostico"
	"techlab/backend-go/internal/email"
	"techlab/backend-go/internal/pagamento"
	"techlab/backend-go/internal/painel"
	"techlab/backend-go/internal/users"
	"techlab/backend-go/internal/whatsapp"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// SecurityHeadersMiddleware adds common security headers to responses.
func SecurityHeadersMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("X-Content-Type-Options", "nosniff")
		c.Header("X-Frame-Options", "DENY")
		c.Header("Referrer-Policy", "no-referrer")
		// In a production environment, you would also set a strict Content-Security-Policy.
		// c.Header("Content-Security-Policy", "default-src 'self'")
		c.Next()
	}
}

// RateLimitMiddleware is a placeholder for a request limiting middleware.
// In a real production environment, use a library like 'tollbooth' with a Redis store.
func RateLimitMiddleware(limit int, window time.Duration) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Placeholder: In a real app, implement IP-based rate limiting here.
		// For example, using an in-memory map with a mutex or a Redis-backed solution.
		// log.Printf("DEBUG: Rate limit check for IP: %s", c.ClientIP())
		c.Next()
	}
}

// NewServer creates and configures a new Gin server.
func NewServer(db *sql.DB) *gin.Engine {
	// Set Gin to release mode for production, or debug mode.
	if gin.Mode() == gin.ReleaseMode {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.New()

	// Middlewares - Order is important: RequestID -> Logger -> Recovery -> Security
	router.Use(RequestIDMiddleware())
	router.Use(LoggerMiddleware())
	router.Use(gin.Recovery())
	router.Use(SecurityHeadersMiddleware())

	// CORS configuration
	// Allow only the specific frontend URL.
	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		frontendURL = "http://localhost:9002" // Default for local dev
	}
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{frontendURL},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "X-Request-ID", "Asaas-Webhook-Token"},
		ExposeHeaders:    []string{"Content-Length", "X-Request-ID"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		healthStatus := gin.H{
			"api":       "ok",
			"db":        "ok",
			"ia":        "ok", // Mocked status, in a real scenario this would ping the AI service
			"timestamp": time.Now().UTC().Format(time.RFC3339),
		}
		status := http.StatusOK

		// Check database connection
		if err := db.Ping(); err != nil {
			log.Printf("ERROR: Healthcheck DB ping failed: %v", err)
			healthStatus["db"] = "down"
			status = http.StatusInternalServerError
		}

		c.JSON(status, healthStatus)
	})

	// Basic metrics endpoint (placeholder)
	router.GET("/metrics", func(c *gin.Context) {
		// In a real app, this would be populated from a metrics collector (e.g., Prometheus client)
		c.JSON(http.StatusOK, gin.H{
			"requests_total": gin.H{
				"/auth/login": 1024,
				"/health":     5120,
			},
			"errors_5xx_total": 15,
			"avg_response_ms":  78,
		})
	})

	// Rate Limiter
	rateLimiter := RateLimitMiddleware(20, time.Minute) // 20 requests per minute

	// Webhook endpoints for WhatsApp - apply rate limiting
	router.GET("/webhooks/whatsapp", whatsapp.VerifyWebhook)
	router.POST("/webhooks/whatsapp", rateLimiter, whatsapp.ReceiveWebhook)

	// Initialize repositories
	userRepo := users.NewRepository(db)
	pagamentoRepo := pagamento.NewRepository(db)
	painelRepo := painel.NewRepository(db)

	// Initialize services
	authSvc, err := auth.NewService(userRepo)
	if err != nil {
		log.Fatalf("FATAL: Could not initialize auth service: %v", err)
	}
	painelSvc := painel.NewService(painelRepo, userRepo)
	diagSvc := diagnostico.NewService()
	pagamentoSvc := pagamento.NewService(pagamentoRepo, userRepo)

	// Initialize handlers
	authHandler := auth.NewHandler(authSvc)
	usersHandler := users.NewHandler(userRepo)
	painelHandler := painel.NewHandler(painelSvc)
	diagHandler := diagnostico.NewHandler(diagSvc)
	pagamentoHandler := pagamento.NewHandler(pagamentoSvc)

	// API versioning group
	v1 := router.Group("/v1")
	{
		// Public auth routes
		authRoutes := v1.Group("/auth")
		{
			authRoutes.POST("/register", rateLimiter, authHandler.Register)
			authRoutes.POST("/login", rateLimiter, authHandler.Login)
		}

		// Public webhook routes
		v1.POST("/webhooks/asaas/payment", rateLimiter, pagamentoHandler.AsaasWebhookHandler)

		// Public donations route
		v1.GET("/donations", pagamentoHandler.GetDonationsHandler)

		// Authenticated routes
		api := v1.Group("/")
		api.Use(auth.AuthRequired())
		{
			// User
			api.GET("/users/me", usersHandler.GetMe)

			// Painel
			api.GET("/cliente/painel", painelHandler.GetPainel)

			// Diagnostico
			api.GET("/diagnostico/resultado", diagHandler.GetResultadoHandler)
			// TODO: Add POST /diagnostico/start and PATCH /diagnostico/step

			// Pagamento
			api.POST("/pagamentos/create", pagamentoHandler.CreatePaymentHandler)
			// TODO: Add GET /pagamentos/status
		}
	}

	return router
}

// RequestIDMiddleware adds a unique request ID to each request.
func RequestIDMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		requestID := uuid.New().String()
		c.Set("request_id", requestID)
		c.Writer.Header().Set("X-Request-ID", requestID)
		c.Next()
	}
}

// LoggerMiddleware provides a JSON structured logger.
func LoggerMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		c.Next() // Process request

		latency := time.Since(start)
		status := c.Writer.Status()

		logMap := gin.H{
			"level":      "info",
			"timestamp":  start.UTC().Format(time.RFC3339),
			"request_id": c.GetString("request_id"),
			"endpoint":   c.Request.URL.Path,
			"method":     c.Request.Method,
			"status":     status,
			"latency_ms": latency.Milliseconds(),
			"client_ip":  c.ClientIP(),
		}

		if userID, exists := c.Get("userID"); exists {
			logMap["user_id"] = userID
		}

		if len(c.Errors) > 0 {
			logMap["level"] = "error"
			logMap["error"] = c.Errors.ByType(gin.ErrorTypePrivate).String()
		}

		if status >= 500 {
			logMap["level"] = "error"
		} else if status >= 400 {
			logMap["level"] = "warning"
		}

		logJSON, err := json.Marshal(logMap)
		if err != nil {
			// Fallback if JSON marshaling fails
			fmt.Fprintf(os.Stdout, "[LOGGER_ERROR] Failed to marshal log: %v\n", err)
		} else {
			fmt.Fprintln(os.Stdout, string(logJSON))
		}
	}
}
