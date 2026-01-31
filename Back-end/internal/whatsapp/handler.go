package whatsapp

import (
	"os"

	"github.com/gin-gonic/gin"
)

// VerifyWebhook handles the webhook verification request from Meta.
func VerifyWebhook(c *gin.Context) {
	mode := c.Query("hub.mode")
	token := c.Query("hub.verify_token")
	challenge := c.Query("hub.challenge")

	if mode == "subscribe" && token == os.Getenv("WHATSAPP_WEBHOOK_VERIFY_TOKEN") {
		c.String(200, challenge)
		return
	}

	c.JSON(403, gin.H{"error": "invalid verify token"})
}

// ReceiveWebhook handles incoming webhook events from Meta (e.g., messages).
func ReceiveWebhook(c *gin.Context) {
	var payload map[string]interface{}

	if err := c.BindJSON(&payload); err != nil {
		c.JSON(400, gin.H{"error": "invalid payload"})
		return
	}

	// aqui você:
	// - identifica o projeto
	// - registra log
	// - envia para IA
	// - responde via WhatsApp API

	c.Status(200)
}
