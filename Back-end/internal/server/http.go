package server

import (
	"encoding/json"
	"fmt"
	"net/http"
	"techlab/backend-go/internal/whatsapp"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// NewServer creates and configures a new Gin server.
func NewServer() *gin.Engine {
	// Set Gin to release mode for production, or debug mode.
	if gin.Mode() == gin.ReleaseMode {
		gin.SetMode(gin.ReleaseMode)
	}
	
	router := gin.New()

	// Middlewares
	router.Use(gin.Recovery()) // Recover from any panics
	router.Use(LoggerMiddleware())
	router.Use(RequestIDMiddleware())
	
	// CORS configuration
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"}, // In production, restrict this
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "UP",
		})
	})

	// Webhook endpoints for WhatsApp
	router.GET("/webhooks/whatsapp", whatsapp.VerifyWebhook)
	router.POST("/webhooks/whatsapp", whatsapp.ReceiveWebhook)


	// API versioning group
	v1 := router.Group("/v1")
	{
		// Placeholder for future endpoints
		v1.GET("/placeholder", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "API v1 is working"})
		})
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
