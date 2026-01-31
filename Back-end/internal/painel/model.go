package painel

// PainelResponse is the contract for GET /cliente/painel
type PainelResponse struct {
	Plano   string   `json:"plano"`
	Status  string   `json:"status"`
	Modulos []string `json:"modulos"`
}
