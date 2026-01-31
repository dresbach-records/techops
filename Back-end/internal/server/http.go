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

	// Middlewares
	router.Use(gin.Recovery()) // Recover from any panics
	router.Use(LoggerMiddleware())
	router.Use(RequestIDMiddleware())
	router.Use(SecurityHeadersMiddleware()) // Add security headers

	// CORS configuration
	// Allow only the specific frontend URL.
	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		frontendURL = "http://localhost:9002" // Default for local dev
	}
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{frontendURL},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length", "X-Request-ID"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		// Check database connection
		if err := db.Ping(); err != nil {
			log.Printf("ERROR: Database health check failed: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"db": "down"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"db": "ok"})
	})

	// Rate Limiter
	rateLimiter := RateLimitMiddleware(20, time.Minute) // 20 requests per minute

	// Webhook endpoints for WhatsApp - apply rate limiting
	router.GET("/webhooks/whatsapp", whatsapp.VerifyWebhook) // Verification is less critical, but can be limited.
	router.POST("/webhooks/whatsapp", rateLimiter, whatsapp.ReceiveWebhook)

	// Initialize services
	emailSvc, err := email.NewResendService()
	if err != nil {
		log.Printf("WARNING: Could not initialize email service: %v. Emails will be simulated.", err)
	}

	userRepo := users.NewRepository(db)
	authSvc, err := auth.NewService(userRepo)
	if err != nil {
		log.Fatalf("FATAL: Could not initialize auth service: %v", err)
	}
	authHandler := auth.NewHandler(authSvc)
	painelHandler := painel.NewHandler()
	usersHandler := users.NewHandler(userRepo)

	// API versioning group
	v1 := router.Group("/v1")
	{
		// Public routes
		authRoutes := v1.Group("/auth")
		{
			authRoutes.POST("/register", authHandler.Register)
			// Apply rate limiting to login to prevent brute-force attacks.
			authRoutes.POST("/login", rateLimiter, authHandler.Login)
		}

		diagRoutes := v1.Group("/diagnostico")
		{
			diagRoutes.POST("/recommend-plan", diagnostico.RecommendPlanHandler)
		}

		if emailSvc != nil {
			v1.POST("/send-email", email.SendEmailHandler(emailSvc))
		}

		// Apply rate limiting to webhooks to prevent abuse.
		v1.POST("/webhooks/asaas/payment", rateLimiter, pagamento.AsaasWebhookHandler())

		// Authenticated routes
		api := v1.Group("/")
		api.Use(auth.AuthRequired())
		{
			api.GET("/users/me", usersHandler.GetMe)
			api.GET("/dashboard", painelHandler.GetDashboard)
			api.POST("/payments/boleto", pagamento.GenerateBoletoHandler())
		}
	}

	return router
}

// RequestIDMiddleware adds a unique request ID to each request.
func RequestIDMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("X-Request-ID", uuid.New().String())
		c.Next()
	}
}

// LoggerMiddleware provides a simple JSON structured logger.
func LoggerMiddleware() gin.HandlerFunc {
	return gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		logMap := make(map[string]interface{})

		logMap["status_code"] = param.StatusCode
		logMap["client_ip"] = param.ClientIP
		logMap["method"] = param.Method
		logMap["path"] = param.Path
		logMap["latency"] = param.Latency.String()
		logMap["user_agent"] = param.Request.UserAgent()
		logMap["time"] = param.TimeStamp.Format(time.RFC1123)

		if param.ErrorMessage != "" {
			logMap["error"] = param.ErrorMessage
		}

		logJSON, err := json.Marshal(logMap)
		if err != nil {
			// Fallback to string formatting if JSON marshaling fails
			return fmt.Sprintf("[GIN] %v | %3d | %13v | %15s | %-7s %s\n%s",
				param.TimeStamp.Format("2006/01/02 - 15:04:05"),
				param.StatusCode,
				param.Latency,
				param.ClientIP,
				param.Method,
				param.Path,
				param.ErrorMessage,
			)
		}

		return string(logJSON) + "\n"
	})
}
