package pagamento

import (
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

	// In a real scenario, you'd fetch the user's diagnosed plan to get the correct value.
	// For now, we pass a placeholder plan code.
	const placeholderPlanoCodigo = "BUILD"
	const placeholderValor = 2997.00

	paymentResponse, err := h.service.CreatePayment(userID.(string), req, placeholderPlanoCodigo, placeholderValor)
	if err != nil {
		log.Printf("ERROR: failed to create payment: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create payment"})
		return
	}

	c.JSON(http.StatusOK, paymentResponse)
}

// AsaasWebhookHandler handles incoming payment status updates from Asaas.
func (h *Handler) AsaasWebhookHandler(c *gin.Context) {
	webhookToken := os.Getenv("ASAAS_WEBHOOK_TOKEN")
	if webhookToken == "" {
		log.Println("WARNING: ASAAS_WEBHOOK_TOKEN is not set. Webhook security is disabled.")
	}

	// Validate webhook token
	receivedToken := c.GetHeader("asaas-webhook-token")
	if webhookToken != "" && webhookToken != "seu_token_aqui" && receivedToken != webhookToken {
		log.Printf("WARNING: Invalid Asaas webhook token received. IP: %s, Token: '%s'", c.ClientIP(), receivedToken)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid webhook token"})
		return
	}

	// Bind the JSON payload
	var payload AsaasWebhookPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		log.Printf("ERROR: Failed to read Asaas webhook body: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read request body"})
		return
	}

	log.Printf("INFO: Received Asaas Webhook Event '%s' for payment '%s'", payload.Event, payload.Payment.ID)

	// Process the webhook in the service layer
	err := h.service.ProcessAsaasWebhook(payload)
	if err != nil {
		log.Printf("ERROR: Failed to process Asaas webhook: %v", err)
		// We return 200 OK to Asaas to prevent retries for business logic errors.
		// Errors should be monitored and handled internally.
		c.Status(http.StatusOK)
		return
	}

	log.Printf("INFO: Webhook for payment '%s' processed successfully.", payload.Payment.ID)
	c.Status(http.StatusOK)
}

// GetDonationsHandler handles the request to get recent donations.
func (h *Handler) GetDonationsHandler(c *gin.Context) {
	donations, err := h.service.GetDonations()
	if err != nil {
		log.Printf("ERROR: failed to get donations: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get donations"})
		return
	}

	c.JSON(http.StatusOK, donations)
}
