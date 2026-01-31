package pagamento

import (
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

// Handler holds the service for payment handlers
type Handler struct {
	service Service
}

// NewHandler creates a new payment handler
func NewHandler(s Service) *Handler {
	return &Handler{service: s}
}

// CreatePaymentHandler handles the creation of a new payment.
func (h *Handler) CreatePaymentHandler(c *gin.Context) {
	var req CriarPagamentoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload: " + err.Error()})
		return
	}

	userID, _ := c.Get("userID")
	// In a real scenario, you'd also fetch user details from the DB
	// and the specific plan/amount to be charged.

	paymentResponse, err := h.service.CreatePayment(userID.(string), req)
	if err != nil {
		log.Printf("ERROR: failed to create payment: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create payment"})
		return
	}

	c.JSON(http.StatusOK, paymentResponse)
}

// AsaasWebhookHandler handles incoming payment status updates from Asaas.
func AsaasWebhookHandler() gin.HandlerFunc {
	webhookToken := os.Getenv("ASAAS_WEBHOOK_TOKEN")
	if webhookToken == "" {
		log.Println("WARNING: ASAAS_WEBHOOK_TOKEN is not set. Webhook security is disabled.")
	}

	return func(c *gin.Context) {
		receivedToken := c.GetHeader("asaas-webhook-token")
		if webhookToken != "" && webhookToken != "seu_token_aqui" && receivedToken != webhookToken {
			log.Printf("WARNING: Invalid Asaas webhook token received. IP: %s, Token: '%s'", c.ClientIP(), receivedToken)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid webhook token"})
			return
		}

		body, err := ioutil.ReadAll(c.Request.Body)
		if err != nil {
			log.Printf("ERROR: Failed to read Asaas webhook body: %v", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read request body"})
			return
		}

		log.Printf("INFO: Received Asaas Webhook: %s", string(body))
		// TODO: Implement webhook processing logic here.
		// - Parse JSON, find payment, update status, unlock features.

		c.Status(http.StatusOK)
	}
}
