package diagnostico

// Plano is the contract for a plan.
type Plano struct {
	Codigo      string  `json:"codigo"`
	Nome        string  `json:"nome"`
	SetupValor  float64 `json:"setup_valor"`
	MensalValor float64 `json:"mensal_valor,omitempty"`
}

// DiagnosticoResultadoResponse is the contract for GET /diagnostico/resultado
type DiagnosticoResultadoResponse struct {
	Plano         Plano  `json:"plano"`
	Justificativa string `json:"justificativa"`
	NextAction    string `json:"next_action"`
}
