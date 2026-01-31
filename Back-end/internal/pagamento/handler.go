package pagamento

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GenerateBoletoRequest defines the structure for the boleto generation request.
type GenerateBoletoRequest struct {
	UserID       string  `json:"user_id" binding:"required"`
	UserName     string  `json:"user_name" binding:"required"`
	UserEmail    string  `json:"user_email" binding:"required"`
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

		// 1. Create or get customer in Asaas, using our UserID as the external reference.
		customer, err := asaasService.CreateAsaasCustomer(req.UserName, req.UserEmail, req.UserCPF, req.UserID)
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
