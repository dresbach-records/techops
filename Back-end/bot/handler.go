package main

import (
	"context"
	"crypto/rand"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"
	"techlab/bot/core"
	"time"

	"github.com/gin-gonic/gin"
)

// logJSON is a helper for structured JSON logging.
func logJSON(fields map[string]interface{}) {
	fields["service"] = "techlab-bot"
	fields["timestamp"] = time.Now().UTC().Format(time.RFC3339)
	jsonLog, err := json.Marshal(fields)
	if err != nil {
		fmt.Fprintf(os.Stdout, `{"level":"error", "service":"techlab-bot", "error":"failed to marshal log", "original_error":"%v"}\n`, err)
		return
	}
	fmt.Fprintln(os.Stdout, string(jsonLog))
}

// newRequestID generates a simple pseudo-random request ID.
func newRequestID() string {
	b := make([]byte, 16)
	rand.Read(b)
	return fmt.Sprintf("%x", b)
}


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
		logJSON(map[string]interface{}{"level": "error", "error": "WHATSAPP_VERIFY_TOKEN is not set"})
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Bot not configured"})
		return
	}

	if mode == "subscribe" && token == verifyToken {
		logJSON(map[string]interface{}{"level": "info", "action": "webhook_verification", "status": "success"})
		c.String(http.StatusOK, challenge)
		return
	}

	logJSON(map[string]interface{}{
		"level":          "error",
		"action":         "webhook_verification",
		"status":         "failed",
		"received_mode":  mode,
		"received_token": token,
	})
	c.JSON(http.StatusForbidden, gin.H{"error": "Invalid verify token"})
}

// HandleWebhook processes incoming messages from users.
func (h *BotHandler) HandleWebhook(c *gin.Context) {
	requestID := newRequestID()

	var payload WhatsAppWebhookPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		logJSON(map[string]interface{}{
			"level":      "error",
			"request_id": requestID,
			"error":      "failed to parse webhook payload",
			"details":    err.Error(),
		})
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
		return
	}

	// Process messages
	if len(payload.Entry) > 0 && len(payload.Entry[0].Changes) > 0 {
		change := payload.Entry[0].Changes[0]
		if change.Field == "messages" && len(change.Value.Messages) > 0 {
			message := change.Value.Messages[0]
			userPhone := message.From

			// Idempotency Check
			isProcessed, err := h.StateManager.IsMessageProcessed(message.ID)
			if err != nil {
				logJSON(map[string]interface{}{
					"level":      "error",
					"request_id": requestID,
					"phone":      userPhone,
					"message_id": message.ID,
					"error":      "failed to check message idempotency",
					"details":    err.Error(),
				})
			}
			if isProcessed {
				logJSON(map[string]interface{}{
					"level":      "info",
					"request_id": requestID,
					"phone":      userPhone,
					"message_id": message.ID,
					"status":     "duplicate_message_skipped",
				})
				c.Status(http.StatusOK)
				return
			}

			// Get current user state
			currentState, sessionData := h.StateManager.GetState(userPhone)
			
			logJSON(map[string]interface{}{
				"level":         "info",
				"request_id":    requestID,
				"phone":         userPhone,
				"message_id":    message.ID,
				"current_state": currentState,
				"action":        "message_received",
				"message_body":  message.Text.Body,
			})


			// Process the message
			response, nextState, nextSessionData := ProcessMessage(context.Background(), h.CoreClient, currentState, message, sessionData)

			// Universal Feedback Handling
			if currentState == StateFeedbackAsk && nextState == StateMainMenu {
				rating, err := strconv.Atoi(strings.TrimSpace(message.Text.Body))
				if err == nil && rating > 0 {
					err := h.StateManager.SaveFeedback(userPhone, sessionData.LastFeedbackFlow, rating)
					if err != nil {
						logJSON(map[string]interface{}{"level": "error", "request_id": requestID, "phone": userPhone, "error": "failed to save feedback", "details": err.Error()})
					} else {
						logJSON(map[string]interface{}{"level": "info", "request_id": requestID, "phone": userPhone, "action": "feedback_saved", "flow": sessionData.LastFeedbackFlow, "rating": rating})
					}
				}
			}

			// Send response
			if err := h.WhatsAppClient.SendTextMessage(userPhone, response); err != nil {
				logJSON(map[string]interface{}{"level": "error", "request_id": requestID, "phone": userPhone, "error": "failed to send whatsapp message", "details": err.Error()})
			}

			// Update state
			if currentState != nextState {
				logJSON(map[string]interface{}{
					"level":        "info",
					"request_id":   requestID,
					"phone":        userPhone,
					"action":       "state_transition",
					"from_state":   currentState,
					"to_state":     nextState,
				})
			}
			h.StateManager.SetState(userPhone, nextState, nextSessionData)
			
			// Mark as processed
			if err := h.StateManager.MarkMessageAsProcessed(message.ID); err != nil {
				logJSON(map[string]interface{}{"level": "error", "request_id": requestID, "phone": userPhone, "message_id": message.ID, "error": "failed to mark message as processed", "details": err.Error()})
			}
		}
	}

	c.Status(http.StatusOK)
}
