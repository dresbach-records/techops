package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"techlab/bot/core"

	"github.com/gin-gonic/gin"
)

// BotHandler handles incoming webhook requests.
type BotHandler struct {
	StateManager   StateManager
	WhatsAppClient WhatsAppClient
	CoreClient     core.CoreClient // Add CoreClient
}

// NewBotHandler creates a new bot handler.
func NewBotHandler(sm StateManager, wac WhatsAppClient, cc core.CoreClient) *BotHandler {
	return &BotHandler{
		StateManager:   sm,
		WhatsAppClient: wac,
		CoreClient:     cc, // Inject CoreClient
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

			// Get current user state and session data
			currentState, sessionData := h.StateManager.GetState(userPhone)
			log.Printf("INFO: User %s [State: %s] | Received: '%s'", userPhone, currentState, message.Text.Body)

			// Process the message to get the response and next state
			// Pass the CoreClient and a context to the message processor
			response, nextState, nextSessionData := ProcessMessage(context.Background(), h.CoreClient, currentState, message, sessionData)

			// Universal Feedback Handling
			// If the previous state was asking for feedback, and the next state is back to menu, it means feedback was given.
			if currentState == StateFeedbackAsk && nextState == StateMainMenu {
				rating, err := strconv.Atoi(strings.TrimSpace(message.Text.Body))
				if err == nil && rating > 0 {
					// Save the feedback using the context stored in the session
					err := h.StateManager.SaveFeedback(userPhone, sessionData.LastFeedbackFlow, rating)
					if err != nil {
						log.Printf("ERROR: Failed to save feedback for user %s: %v", userPhone, err)
					}
				}
			}

			// Send the response back to the user
			if err := h.WhatsAppClient.SendTextMessage(userPhone, response); err != nil {
				log.Printf("ERROR: Failed to send message to %s: %v", userPhone, err)
			} else {
				log.Printf("INFO: User %s [State: %s] | Replied: '%s'", userPhone, nextState, response)
			}

			// Update the user's state and session data
			h.StateManager.SetState(userPhone, nextState, nextSessionData)
			log.Printf("INFO: User %s | State transition: %s -> %s", userPhone, currentState, nextState)
		}
	}

	c.Status(http.StatusOK)
}
