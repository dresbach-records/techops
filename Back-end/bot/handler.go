package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

// BotHandler handles incoming webhook requests.
type BotHandler struct {
	StateManager   StateManager
	WhatsAppClient WhatsAppClient
}

// NewBotHandler creates a new bot handler.
func NewBotHandler(sm StateManager, wac WhatsAppClient) *BotHandler {
	return &BotHandler{
		StateManager:   sm,
		WhatsAppClient: wac,
	}
}

// VerifyWebhook handles the webhook verification request from Meta.
func (h *BotHandler) VerifyWebhook(c *gin.Context) {
	mode := c.Query("hub.mode")
	token := c.Query("hub.verify_token")
	challenge := c.Query("hub.challenge")

	verifyToken := os.Getenv("WHATSAPP_VERIFY_TOKEN")
	if verifyToken == "" {
		log.Println("CRITICAL: WHATSAPP_VERIFY_TOKEN is not set.")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Bot not configured"})
		return
	}

	if mode == "subscribe" && token == verifyToken {
		log.Println("SUCCESS: WhatsApp Webhook verification successful.")
		c.String(http.StatusOK, challenge)
		return
	}

	log.Printf("ERROR: WhatsApp Webhook verification failed. Mode: '%s', Received Token: '%s'", mode, token)
	c.JSON(http.StatusForbidden, gin.H{"error": "Invalid verify token"})
}

// HandleWebhook processes incoming messages from users.
func (h *BotHandler) HandleWebhook(c *gin.Context) {
	var payload WhatsAppWebhookPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		log.Printf("ERROR: Failed to parse webhook payload: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
		return
	}

	// Process messages
	if len(payload.Entry) > 0 && len(payload.Entry[0].Changes) > 0 {
		change := payload.Entry[0].Changes[0]
		if change.Field == "messages" && len(change.Value.Messages) > 0 {
			message := change.Value.Messages[0]
			userPhone := message.From
			
			// Get current user state
			currentState := h.StateManager.GetState(userPhone)
			log.Printf("User %s is in state '%s', received message: '%s'", userPhone, currentState, message.Text.Body)

			// Process the message based on the current state and get the next state
			response, nextState := ProcessMessage(currentState, message)

			// Send the response back to the user
			if err := h.WhatsAppClient.SendTextMessage(userPhone, response); err != nil {
				log.Printf("ERROR: Failed to send message to %s: %v", userPhone, err)
			} else {
				log.Printf("Sent response to %s: '%s'", userPhone, response)
			}

			// Update the user's state
			h.StateManager.SetState(userPhone, nextState)
			log.Printf("Transitioned user %s to state '%s'", userPhone, nextState)
		}
	}

	c.Status(http.StatusOK)
}
