package pagamento

// This file defines the models for payment processing with Asaas.

// AsaasCustomer represents a customer in Asaas.
type AsaasCustomer struct {
	ID                string `json:"id"`
	Name              string `json:"name"`
	Email             string `json:"email"`
	CpfCnpj           string `json:"cpfCnpj,omitempty"`
	ExternalReference string `json:"externalReference,omitempty"`
}

// AsaasPayment represents a payment object from Asaas.
type AsaasPayment struct {
	ID          string  `json:"id"`
	Customer    string  `json:"customer"`
	BillingType string  `json:"billingType"`
	Value       float64 `json:"value"`
	DueDate     string  `json:"dueDate"`
	Description string  `json:"description"`
	BankSlipUrl string  `json:"bankSlipUrl"`
	Status      string  `json:"status"`
	InvoiceUrl  string  `json:"invoiceUrl"`
}
