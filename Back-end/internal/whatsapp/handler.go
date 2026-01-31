package whatsapp

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

// VerifyWebhook handles the webhook verification request from Meta, a mandatory step for going LIVE.
func VerifyWebhook(c *gin.Context) {
	mode := c.Query("hub.mode")
	token := c.Query("hub.verify_token")
	challenge := c.Query("hub.challenge")

	verifyToken := os.Getenv("WHATSAPP_WEBHOOK_VERIFY_TOKEN")
	if verifyToken == "" || verifyToken == "CHANGE_ME_IN_META_DEV_PORTAL" {
		log.Println("CRITICAL: WHATSAPP_WEBHOOK_VERIFY_TOKEN is not set. Verification will fail.")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "webhook not configured"})
		return
	}

	log.Printf("INFO: Attempting WhatsApp Webhook Verification: mode=%s", mode)

	if mode == "subscribe" && token == verifyToken {
		log.Println("SUCCESS: WhatsApp Webhook verification successful.")
		c.String(http.StatusOK, challenge)
		return
	}

	log.Printf("ERROR: WhatsApp Webhook verification failed. Mode: '%s', Received Token: '%s'", mode, token)
	c.JSON(http.StatusForbidden, gin.H{"error": "invalid verify token"})
}

// ReceiveWebhook handles incoming webhook events from Meta (e.g., messages, status updates).
func ReceiveWebhook(c *gin.Context) {
	// 1. Read the raw body for signature validation, which is mandatory for production.
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		log.Printf("ERROR: Failed to read WhatsApp webhook body: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read request body"})
		return
	}

	// 2. Validate the X-Hub-Signature-256 header to ensure the request is from Meta.
	appSecret := os.Getenv("WHATSAPP_APP_SECRET")
	if appSecret != "" && appSecret != "CHANGE_ME_IN_META_DEV_PORTAL" {
		signature := c.GetHeader("X-Hub-Signature-256")
		if !validateSignature(signature, body, appSecret) {
			log.Printf("ERROR: Invalid WhatsApp webhook signature. IP: %s, Header: %s", c.ClientIP(), signature)
			c.JSON(http.StatusForbidden, gin.H{"error": "invalid signature"})
			return
		}
		log.Println("SUCCESS: WhatsApp webhook signature validated.")
	} else {
		log.Println("WARNING: WHATSAPP_APP_SECRET not set. Skipping signature validation. NOT SAFE FOR PRODUCTION.")
	}

	// 3. Log the full payload for auditing and debugging (simulates `whatsapp_logs` table entry).
	log.Printf("INFO: Received WhatsApp Webhook (direction: in): %s", string(body))

	// 4. Unmarshal payload to process it.
	var payload map[string]interface{}
	if err := json.Unmarshal(body, &payload); err != nil {
		log.Printf("ERROR: Failed to unmarshal WhatsApp webhook payload: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload format"})
		return
	}

	// TODO: Implement the full processing pipeline as per roadmap.
	// - Parse payload to extract phone_number_id, message_id, etc.
	// - Check if message_id has been processed to ensure idempotency (query `whatsapp_logs`).
	// - Find project by phone_number_id (query `whatsapp_projects`).
	// - If project found, save incoming message to `whatsapp_logs` with project_id.
	// - Process message (apply rules, call IA if needed).
	// - Send reply via WhatsApp Graph API using the project's access_token.
	// - Save outgoing message to `whatsapp_logs` with project_id.

	// 5. Respond to Meta immediately to acknowledge receipt.
	c.Status(http.StatusOK)
}

// validateSignature checks if the incoming webhook payload is genuinely from Meta.
func validateSignature(signature string, body []byte, secret string) bool {
	if !strings.HasPrefix(signature, "sha256=") {
		return false
	}

	actualSignatureHex := strings.TrimPrefix(signature, "sha256=")
	decodedSignature, err := hex.DecodeString(actualSignatureHex)
	if err != nil {
		log.Printf("ERROR: Could not decode signature hex: %v", err)
		return false
	}

	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write(body)
	expectedMAC := mac.Sum(nil)

	return hmac.Equal(decodedSignature, expectedMAC)
}
