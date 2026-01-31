package pagamento

import (
	"fmt"

	"github.com/google/uuid"
)

// Service manages payment logic.
type Service interface {
	CreatePayment(userID string, req CriarPagamentoRequest) (*CriarPagamentoResponse, error)
}

type service struct {
	// In a real implementation, this would have HTTP clients and configs
	// for the payment provider (e.g., Asaas).
}

// NewService creates a new payment service.
func NewService() Service {
	return &service{}
}

// CreatePayment generates a new payment link.
// MOCK IMPLEMENTATION: This should interact with a real payment provider API.
func (s *service) CreatePayment(userID string, req CriarPagamentoRequest) (*CriarPagamentoResponse, error) {
	// 1. Get user data.
	// 2. Get plan/product data to determine the amount. For a 'setup' fee,
	// this would come from the 'planos' table associated with the user's 'diagnostico'.
	// 3. Call the payment provider's API to create a charge/link.
	// 4. Store the payment intent in the 'pagamentos' table with 'aguardando' status.

	// Mocking the response.
	paymentID := uuid.New().String()
	mockCheckoutURL := fmt.Sprintf("https://sandbox.asaas.com/c/1p4y9i7o8z6x_/%s", paymentID)

	resp := &CriarPagamentoResponse{
		PaymentID:   paymentID,
		Status:      "aguardando",
		CheckoutURL: mockCheckoutURL,
	}

	return resp, nil
}
