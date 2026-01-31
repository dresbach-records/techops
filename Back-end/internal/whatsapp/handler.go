package whatsapp

import (
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

// VerifyWebhook handles the webhook verification request from Meta.
func VerifyWebhook(c *gin.Context) {
	mode := c.Query("hub.mode")
	token := c.Query("hub.verify_token")
	challenge := c.Query("hub.challenge")

	verifyToken := os.Getenv("WHATSAPP_WEBHOOK_VERIFY_TOKEN")

	log.Printf("WhatsApp Webhook Verification: mode=%s, token=%s, challenge=%s", mode, token, challenge)

	if mode == "subscribe" && token == verifyToken && verifyToken != "" {
		log.Println("WhatsApp Webhook verification successful.")
		c.String(http.StatusOK, challenge)
		return
	}

	log.Println("WhatsApp Webhook verification failed: invalid token or mode.")
	c.JSON(http.StatusForbidden, gin.H{"error": "invalid verify token"})
}

// ReceiveWebhook handles incoming webhook events from Meta (e.g., messages).
func ReceiveWebhook(c *gin.Context) {
	var payload map[string]interface{}

	if err := c.ShouldBindJSON(&payload); err != nil {
		log.Printf("ERROR: Failed to bind WhatsApp webhook payload: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
		return
	}

	// Log the full payload for auditing and debugging.
	payloadJSON, _ := json.Marshal(payload)
	log.Printf("INFO: Received WhatsApp Webhook: %s", string(payloadJSON))

	// Placeholder for future logic based on the roadmap.
	// - Identificar o projeto associado (pelo Business ID ou Phone Number ID)
	// - Registrar o log da mensagem em `whatsapp_logs` no banco de dados
	// - Enviar a mensagem para a IA para processamento (via backend)
	// - Responder ao usuário via WhatsApp Graph API

	// Respond immediately to Meta to acknowledge receipt.
	c.Status(http.StatusOK)
}
