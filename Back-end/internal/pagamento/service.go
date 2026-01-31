package pagamento

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"
)

// Service manages payment logic with Asaas.
type Service struct {
	httpClient  *http.Client
	asaasAPIKey string
	asaasBaseURL string
}

// NewAsaasService creates a new payment service for Asaas.
func NewAsaasService() *Service {
	return &Service{
		httpClient:  &http.Client{Timeout: 20 * time.Second},
		asaasAPIKey: os.Getenv("ASAAS_API_KEY"),
		asaasBaseURL: os.Getenv("ASAAS_API_BASE"),
	}
}

// CreateAsaasCustomer creates or retrieves a customer in Asaas.
// Asaas automatically handles de-duplication based on cpfCnpj.
func (s *Service) CreateAsaasCustomer(name, email, cpf, externalRef string) (*AsaasCustomer, error) {
	payload := map[string]interface{}{
		"name":                 name,
		"email":                email,
		"notificationDisabled": true,
		"externalReference":    externalRef,
	}
	if cpf != "" {
		payload["cpfCnpj"] = cpf
	}

	body, _ := json.Marshal(payload)
	req, err := http.NewRequest("POST", s.asaasBaseURL+"/v3/customers", bytes.NewBuffer(body))
	if err != nil {
		return nil, fmt.Errorf("failed to create asaas customer request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("access_token", s.asaasAPIKey)

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to call asaas customer api: %w", err)
	}
	defer resp.Body.Close()

	respBody, _ := ioutil.ReadAll(resp.Body)
	if resp.StatusCode >= 300 {
		return nil, fmt.Errorf("asaas customer api error (%d): %s", resp.StatusCode, string(respBody))
	}

	var customer AsaasCustomer
	if err := json.Unmarshal(respBody, &customer); err != nil {
		return nil, fmt.Errorf("failed to decode asaas customer response: %w", err)
	}

	log.Printf("Asaas customer operation successful for externalRef %s. Asaas ID: %s", externalRef, customer.ID)
	return &customer, nil
}

// GenerateBoleto generates a new boleto payment in Asaas.
func (s *Service) GenerateBoleto(customerID string, value float64, description, diagnosticID string) (*AsaasPayment, error) {
	payload := map[string]interface{}{
		"customer":          customerID,
		"billingType":       "BOLETO",
		"value":             value,
		"dueDate":           time.Now().AddDate(0, 0, 7).Format("2006-01-02"), // Due in 7 days
		"description":       description,
		"externalReference": diagnosticID,
	}

	body, _ := json.Marshal(payload)
	req, err := http.NewRequest("POST", s.asaasBaseURL+"/v3/payments", bytes.NewBuffer(body))
	if err != nil {
		return nil, fmt.Errorf("failed to create asaas payment request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("access_token", s.asaasAPIKey)

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to call asaas payment api: %w", err)
	}
	defer resp.Body.Close()

	respBody, _ := ioutil.ReadAll(resp.Body)
	if resp.StatusCode >= 300 {
		return nil, fmt.Errorf("asaas payment api error (%d): %s", resp.StatusCode, string(respBody))
	}

	var payment AsaasPayment
	if err := json.Unmarshal(respBody, &payment); err != nil {
		return nil, fmt.Errorf("failed to decode asaas payment response: %w", err)
	}

	log.Printf("Successfully generated Asaas boleto %s for diagnostic %s", payment.ID, diagnosticID)
	return &payment, nil
}
