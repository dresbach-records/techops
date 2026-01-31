package pagamento

import (
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

// GenerateBoletoRequest defines the structure for the boleto generation request.
// User information will be extracted from the JWT token.
type GenerateBoletoRequest struct {
	UserCPF      string  `json:"user_cpf"`
	DiagnosticID string  `json:"diagnostic_id" binding:"required"`
	Amount       float64 `json:"amount" binding:"required"`
	Description  string  `json:"description" binding:"required"`
}

// GenerateBoletoHandler handles the creation of a new customer and a boleto payment via Asaas.
func GenerateBoletoHandler() gin.HandlerFunc {
	asaasService := NewAsaasService()

	return func(c *gin.Context) {
		var req GenerateBoletoRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload: " + err.Error()})
			return
		}

		// Extract user info from JWT context set by the AuthRequired middleware.
		userID, _ := c.Get("userID")
		userName, _ := c.Get("userName")
		userEmail, _ := c.Get("userEmail")

		if userID == nil || userName == nil || userEmail == nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "User information not found in token"})
			return
		}

		// 1. Create or get customer in Asaas, using our UserID as the external reference.
		customer, err := asaasService.CreateAsaasCustomer(userName.(string), userEmail.(string), req.UserCPF, userID.(string))
		if err != nil {
			log.Printf("ERROR: failed to create Asaas customer: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create payment customer"})
			return
		}

		// 2. Generate boleto payment using the Asaas customer ID.
		payment, err := asaasService.GenerateBoleto(customer.ID, req.Amount, req.Description, req.DiagnosticID)
		if err != nil {
			log.Printf("ERROR: failed to generate Asaas boleto: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate boleto"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message":           "Boleto generated successfully",
			"asaas_customer_id": customer.ID,
			"asaas_payment_id":  payment.ID,
			"boleto_url":        payment.BankSlipUrl,
			"invoice_url":       payment.InvoiceUrl,
			"status":            payment.Status,
		})
	}
}

// AsaasWebhookHandler handles incoming payment status updates from Asaas.
func AsaasWebhookHandler() gin.HandlerFunc {
	// Get the configured token from environment. Should be a strong, unguessable string.
	webhookToken := os.Getenv("ASAAS_WEBHOOK_TOKEN")
	if webhookToken == "" {
		log.Println("WARNING: ASAAS_WEBHOOK_TOKEN is not set. Webhook security is disabled.")
	}

	return func(c *gin.Context) {
		// 1. Verify the security token from Asaas
		receivedToken := c.GetHeader("asaas-webhook-token")
		if webhookToken != "" && webhookToken != "seu_token_aqui" && receivedToken != webhookToken {
			log.Printf("WARNING: Invalid Asaas webhook token received. Got: '%s'", receivedToken)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid webhook token"})
			return
		}

		// 2. Log the full payload for auditing and future processing
		body, err := ioutil.ReadAll(c.Request.Body)
		if err != nil {
			log.Printf("ERROR: Failed to read Asaas webhook body: %v", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read request body"})
			return
		}

		log.Printf("INFO: Received Asaas Webhook: %s", string(body))

		// TODO:
		// - Parse the JSON body to an AsaasWebhookPayload struct.
		// - Check `payload.event` (e.g., "PAYMENT_CONFIRMED", "PAYMENT_RECEIVED").
		// - Find the local payment record using `payload.payment.externalReference` (which is our diagnostic ID).
		// - Update the payment status in the database.
		// - If payment is confirmed, unlock the customer's full dashboard access.

		// 3. Respond to Asaas immediately to acknowledge receipt.
		c.Status(http.StatusOK)
	}
}
