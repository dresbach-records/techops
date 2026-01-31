package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"techlab/bot/core"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

// logJSON is a helper for structured JSON logging.
func logJSON(fields map[string]interface{}) {
	fields["service"] = "techlab-bot"
	jsonLog, err := json.Marshal(fields)
	if err != nil {
		fmt.Fprintf(os.Stdout, `{"level":"error", "service":"techlab-bot", "error":"failed to marshal log", "original_error":"%v"}\n`, err)
		return
	}
	fmt.Fprintln(os.Stdout, string(jsonLog))
}

func main() {
	// In a real app, this path would be configured more robustly
	err := godotenv.Load("../.env")
	if err != nil {
		logJSON(map[string]interface{}{"level": "warning", "message": ".env file not found, relying on environment variables."})
	}

	var stateManager StateManager
	var db *sql.DB

	// Attempt to connect to the database
	db, err = Connect()
	if err != nil {
		logJSON(map[string]interface{}{"level": "warning", "message": "Could not connect to database, falling back to in-memory state", "error": err.Error()})
		stateManager = NewInMemoryStateManager()
	} else {
		// If DB connection is successful, use the SQL-backed state manager
		defer db.Close()
		stateManager = NewSQLStateManager(db)
	}

	// Initialize the real HTTP client for the core backend.
	logJSON(map[string]interface{}{"level": "info", "message": "Initializing HTTP CoreClient..."})
	coreClient := core.NewHTTPClient(
		os.Getenv("CORE_API_URL"),
		os.Getenv("CORE_API_KEY"),
	)

	whatsAppClient := NewWhatsAppClient(os.Getenv("WHATSAPP_GRAPH_API_TOKEN"), os.Getenv("WHATSAPP_PHONE_NUMBER_ID"))
	botHandler := NewBotHandler(stateManager, whatsAppClient, coreClient) // Pass client to handler

	router := gin.Default()

	// --- Tech Ops Endpoints ---
	router.GET("/health", func(c *gin.Context) {
		healthStatus := gin.H{
			"status": "ok",
			"services": gin.H{
				"database":   "ok",
				"core_api":   "ok",
			},
		}
		httpStatus := http.StatusOK

		// Check Database
		if db != nil {
			if err := db.Ping(); err != nil {
				healthStatus["services"].(gin.H)["database"] = "down"
				httpStatus = http.StatusServiceUnavailable
			}
		} else {
			healthStatus["services"].(gin.H)["database"] = "down"
			httpStatus = http.StatusServiceUnavailable
		}

		// Check Core API
		if err := coreClient.Ping(context.Background()); err != nil {
			healthStatus["services"].(gin.H)["core_api"] = "down"
			httpStatus = http.StatusServiceUnavailable
		}
		
		if httpStatus != http.StatusOK {
			healthStatus["status"] = "degraded"
		}

		c.JSON(httpStatus, healthStatus)
	})

	router.GET("/metrics", func(c *gin.Context) {
		// In a real app, these would be dynamic using a Prometheus client library.
		metrics := `# HELP bot_messages_received_total Total number of messages received.
# TYPE bot_messages_received_total counter
bot_messages_received_total 1027

# HELP bot_messages_sent_total Total number of messages sent.
# TYPE bot_messages_sent_total counter
bot_messages_sent_total 986

# HELP bot_sessions_active_total Current number of active sessions.
# TYPE bot_sessions_active_total gauge
bot_sessions_active_total 12

# HELP bot_core_api_latency_ms Latency of requests to the Core API.
# TYPE bot_core_api_latency_ms summary
bot_core_api_latency_ms{quantile="0.5"} 120
bot_core_api_latency_ms{quantile="0.9"} 250
`
		c.String(http.StatusOK, metrics)
	})


	// --- Webhook Endpoints ---
	router.GET("/webhook", botHandler.VerifyWebhook)
	router.POST("/webhook", botHandler.HandleWebhook)

	port := os.Getenv("BOT_PORT")
	if port == "" {
		port = "8081" // Different port from the main API
	}

	logJSON(map[string]interface{}{"level": "info", "message": fmt.Sprintf("WhatsApp Bot server starting on http://localhost:%s", port)})
	if err := router.Run(":" + port); err != nil {
		logJSON(map[string]interface{}{"level": "fatal", "message": "Failed to start bot server", "error": err.Error()})
	}
}
