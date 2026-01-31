package ia

import "encoding/json"

// This file is the official, centralized client for interacting with the AI service.
// Per the architectural roadmap (Day 6), the Go backend is the ONLY component
// allowed to communicate with the AI service. The frontend is strictly prohibited
// from making direct calls.

// IAResponse defines the structured JSON response expected from the AI service.
// The AI service must not return free text for decision-making.
type IAResponse struct {
	RiscoTecnico      string   `json:"risco_tecnico"`
	PlanoRecomendado  string   `json:"plano_recomendado"`
	ModulosSugeridos  []string `json:"modulos_sugeridos"`
	Observacoes       string   `json:"observacoes"`
}

// IAService defines the contract for our AI interactions.
type IAService interface {
	AnalisarDiagnostico(input json.RawMessage) (*IAResponse, error)
}

// NewIAService creates a new client to communicate with the AI service.
// In a real implementation, this would contain an HTTP client with proper
// timeouts, retries, and configuration to call the external AI service endpoint.
func NewIAService() (IAService, error) {
	// http_client := http.NewClient(...)
	// return &serviceImpl{client: http_client}, nil
	return &mockIAService{}, nil // Using a mock for now
}


// mockIAService is a placeholder implementation.
type mockIAService struct {}

func (s *mockIAService) AnalisarDiagnostico(input json.RawMessage) (*IAResponse, error) {
	// In a real scenario:
	// 1. Send `input` to the external AI service (e.g., Python/Genkit).
	// 2. Receive a JSON response.
	// 3. Unmarshal the JSON into the IAResponse struct.
	// 4. Validate the response. If invalid, discard it and return an error.
	// 5. Before returning, log the input and output to the `ia_logs` table for auditing.

	// Returning a mock response for demonstration purposes:
	mockResp := &IAResponse{
		RiscoTecnico:     "Médio",
		PlanoRecomendado: "BUILD",
		ModulosSugeridos: []string{"visao-geral", "diagnostico", "roadmap", "arquitetura"},
		Observacoes:      "O protótipo precisa de uma arquitetura mais robusta antes de ir para produção.",
	}

	return mockResp, nil
}
