package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// In a real app, this path would be configured more robustly
	err := godotenv.Load("../.env")
	if err != nil {
		log.Println("Warning: .env file not found, relying on environment variables.")
	}

	// Initialize the state manager and WhatsApp client
	stateManager := NewInMemoryStateManager()
	whatsAppClient := NewWhatsAppClient(os.Getenv("WHATSAPP_GRAPH_API_TOKEN"), os.Getenv("WHATSAPP_PHONE_NUMBER_ID"))
	botHandler := NewBotHandler(stateManager, whatsAppClient)

	router := gin.Default()

	// Meta Webhook Verification Endpoint
	router.GET("/webhook", botHandler.VerifyWebhook)
	// Meta Webhook Message Handler
	router.POST("/webhook", botHandler.HandleWebhook)

	port := os.Getenv("BOT_PORT")
	if port == "" {
		port = "8081" // Different port from the main API
	}

	log.Printf("WhatsApp Bot server starting on http://localhost:%s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Failed to start bot server: %v", err)
	}
}
