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
	"techlab/backend-go/internal/pagamento"
	"techlab/backend-go/internal/painel"
	"techlab/backend-go/internal/users"
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
		c.Next()
	}
}

// RateLimitMiddleware is a placeholder for a request limiting middleware.
func RateLimitMiddleware(limit int, window time.Duration) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()
	}
}

// NewServer creates and configures a new Gin server.
func NewServer(db *sql.DB) *gin.Engine {
	if gin.Mode() == gin.ReleaseMode {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.New()

	router.Use(RequestIDMiddleware())
	router.Use(LoggerMiddleware())
	router.Use(gin.Recovery())
	router.Use(SecurityHeadersMiddleware())

	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		frontendURL = "http://localhost:9002"
	}
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{frontendURL, "http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "X-Request-ID", "Asaas-Webhook-Token"},
		ExposeHeaders:    []string{"Content-Length", "X-Request-ID"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	router.GET("/health", func(c *gin.Context) {
		healthStatus := gin.H{
			"api":       "ok",
			"db":        "ok",
			"timestamp": time.Now().UTC().Format(time.RFC3339),
		}
		status := http.StatusOK
		if err := db.Ping(); err != nil {
			log.Printf("ERROR: Healthcheck DB ping failed: %v", err)
			healthStatus["db"] = "down"
			status = http.StatusInternalServerError
		}
		c.JSON(status, healthStatus)
	})

	rateLimiter := RateLimitMiddleware(100, time.Minute)

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
	userSvc := users.NewService(userRepo)

	// Initialize handlers
	usersHandler := users.NewHandler(userSvc)
	painelHandler := painel.NewHandler(painelSvc)
	diagHandler := diagnostico.NewHandler(diagSvc)
	pagamentoHandler := pagamento.NewHandler(pagamentoSvc)

	v1 := router.Group("/v1")
	{
		// Public webhook and donation routes
		v1.POST("/webhooks/asaas/payment", rateLimiter, pagamentoHandler.AsaasWebhookHandler)
		v1.GET("/donations", pagamentoHandler.GetDonationsHandler)

		// Authenticated routes
		api := v1.Group("/")
		api.Use(auth.AuthRequired(userRepo))
		{
			// User registration and profile
			api.POST("/users/register", usersHandler.Register)
			api.GET("/users/me", usersHandler.GetMe)

			// Painel
			api.GET("/cliente/painel", painelHandler.GetPainel)

			// Diagnostico
			api.GET("/diagnostico/resultado", diagHandler.GetResultadoHandler)

			// Pagamento
			api.POST("/pagamentos/create", pagamentoHandler.CreatePaymentHandler)
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
		c.Next()

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
			fmt.Fprintf(os.Stdout, "[LOGGER_ERROR] Failed to marshal log: %v\n", err)
		} else {
			fmt.Fprintln(os.Stdout, string(logJSON))
		}
	}
}
