package pagamento

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

// AsaasWebhookPayload defines the expected structure for Asaas webhooks.
// This can be expanded based on the events you need to handle.
type AsaasWebhookPayload struct {
	Event   string `json:"event"`
	Payment struct {
		ID                string `json:"id"`
		Status            string `json:"status"`
		ExternalReference string `json:"externalReference"`
	} `json:"payment"`
}
