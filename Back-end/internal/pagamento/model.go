package pagamento

import "time"

// CriarPagamentoRequest is the contract for POST /pagamentos/create
type CriarPagamentoRequest struct {
	Tipo   string `json:"tipo" binding:"required,oneof=setup mensal"`
	Metodo string `json:"metodo" binding:"required,oneof=pix boleto credito"`
}

// CriarPagamentoResponse is the contract for the response of POST /pagamentos/create
type CriarPagamentoResponse struct {
	PaymentID   string `json:"payment_id"`
	Status      string `json:"status"`
	CheckoutURL string `json:"checkout_url"`
}

// AsaasWebhookPayload defines the structure for Asaas payment webhooks.
type AsaasWebhookPayload struct {
	Event   string `json:"event"`
	Payment struct {
		ID                string  `json:"id"`
		Status            string  `json:"status"`
		Value             float64 `json:"value"`
		ExternalReference string  `json:"externalReference"`
		// Add other fields you might need from the webhook
	} `json:"payment"`
}

// Pagamento represents a payment record in the database.
type Pagamento struct {
	ID          string    `db:"id"`
	UserID      string    `db:"user_id"`
	PlanoCodigo string    `db:"plano_codigo"`
	Valor       float64   `db:"valor"`
	Metodo      string    `db:"metodo"`
	Status      string    `db:"status"`
	Provider    string    `db:"provider"`
	ProviderID  string    `db:"provider_id"`
	CheckoutURL string    `db:"checkout_url"`
	CreatedAt   time.Time `db:"created_at"`
	UpdatedAt   time.Time `db:"updated_at"`
}
