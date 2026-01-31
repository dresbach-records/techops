package pagamento

import (
	"fmt"
	"log"
	"techlab/backend-go/internal/users"
	"time"

	"github.com/google/uuid"
)

// Service manages payment logic.
type Service interface {
	CreatePayment(userID string, req CriarPagamentoRequest, planoCodigo string, valor float64) (*CriarPagamentoResponse, error)
	ProcessAsaasWebhook(payload AsaasWebhookPayload) error
	GetDonations() ([]AnonymizedDonation, error)
}

type service struct {
	pagamentoRepo Repository
	userRepo      users.Repository
}

// NewService creates a new payment service.
func NewService(pr Repository, ur users.Repository) Service {
	return &service{
		pagamentoRepo: pr,
		userRepo:      ur,
	}
}

// CreatePayment generates a new payment link and saves the record.
func (s *service) CreatePayment(userID string, req CriarPagamentoRequest, planoCodigo string, valor float64) (*CriarPagamentoResponse, error) {
	// In a real scenario, you'd call the Asaas API here to get a real provider_id and checkout_url
	// For now, we mock them.
	mockProviderID := "pay_" + uuid.New().String()
	mockCheckoutURL := fmt.Sprintf("https://sandbox.asaas.com/c/1p4y9i7o8z6x_/%s", mockProviderID)

	pagamento := Pagamento{
		UserID:      userID,
		PlanoCodigo: planoCodigo,
		Valor:       valor,
		Metodo:      req.Metodo,
		Status:      "aguardando",
		Provider:    "asaas",
		ProviderID:  mockProviderID,
		CheckoutURL: mockCheckoutURL,
	}

	err := s.pagamentoRepo.Save(&pagamento)
	if err != nil {
		return nil, fmt.Errorf("failed to save payment record: %w", err)
	}

	resp := &CriarPagamentoResponse{
		PaymentID:   pagamento.ID,
		Status:      pagamento.Status,
		CheckoutURL: pagamento.CheckoutURL,
	}

	return resp, nil
}

// ProcessAsaasWebhook handles the business logic for an incoming Asaas webhook.
func (s *service) ProcessAsaasWebhook(payload AsaasWebhookPayload) error {
	log.Printf("Processing webhook for Asaas payment ID: %s, Event: %s, Status: %s", payload.Payment.ID, payload.Event, payload.Payment.Status)

	// We only care about payment confirmations
	if payload.Event != "PAYMENT_CONFIRMED" {
		log.Printf("Ignoring webhook event '%s' as it is not a confirmation.", payload.Event)
		return nil
	}

	// 1. Find the payment record using the provider's ID
	pagamento, err := s.pagamentoRepo.FindByProviderID(payload.Payment.ID)
	if err != nil {
		return fmt.Errorf("could not find payment with provider ID %s: %w", payload.Payment.ID, err)
	}

	// 2. Idempotency check: if payment is already confirmed, do nothing.
	if pagamento.Status == "confirmado" {
		log.Printf("Payment %s (provider: %s) is already confirmed. Skipping.", pagamento.ID, pagamento.ProviderID)
		return nil
	}

	// 3. Update the payment status in our database
	err = s.pagamentoRepo.UpdateStatus(pagamento.ID, "confirmado")
	if err != nil {
		return fmt.Errorf("failed to update payment status for ID %s: %w", pagamento.ID, err)
	}

	// 4. Update the user's status and flow to unlock the dashboard
	err = s.userRepo.UpdateStatusAndFlow(pagamento.UserID, "ativo", "painel")
	if err != nil {
		// This is a critical error that needs monitoring. If this fails, the user paid but won't get access.
		log.Printf("CRITICAL: Failed to update user status/flow for UserID %s after payment confirmation. Manual intervention required.", pagamento.UserID)
		return fmt.Errorf("failed to update user status for UserID %s: %w", pagamento.UserID, err)
	}

	// 5. (Future) Create the user's specific panel in the 'paineis' table
	log.Printf("User %s access granted. Panel creation logic would be triggered here.", pagamento.UserID)

	return nil
}

// GetDonations returns a list of anonymized donations.
// MOCK IMPLEMENTATION: This should call the Asaas API.
func (s *service) GetDonations() ([]AnonymizedDonation, error) {
	log.Println("INFO: Fetching donations (mocked)")
	// In a real scenario, you would call the Asaas API here to get a list of charges,
	// filter for the ones related to the donation link, and anonymize the data.
	return []AnonymizedDonation{
		{Valor: 50.00, Data: time.Now().Add(-2 * time.Hour)},
		{Valor: 25.00, Data: time.Now().Add(-5 * time.Hour)},
		{Valor: 100.00, Data: time.Now().Add(-25 * time.Hour)},
		{Valor: 10.00, Data: time.Now().Add(-48 * time.Hour)},
		{Valor: 75.00, Data: time.Now().Add(-50 * time.Hour)},
	}, nil
}
