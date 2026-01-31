package painel

import "errors"

// Service defines the business logic for the painel.
type Service interface {
	BuildForUser(userID string) (*PainelResponse, error)
}

type service struct {
	// In a real implementation, a repository would be injected here.
	// repo Repository
}

// NewService creates a new painel service.
func NewService() Service {
	return &service{}
}

// BuildForUser constructs the dashboard data for a specific user.
// This function is the core of the backend-driven dashboard.
// MOCK IMPLEMENTATION: This should fetch data from the 'paineis' table.
func (s *service) BuildForUser(userID string) (*PainelResponse, error) {
	// 1. In a real implementation, check payment status from the 'pagamentos' table.
	// For now, we assume access is granted if they reach this endpoint.
	// if !isPaid(userID) {
	// 	 return nil, errors.New("acesso ao painel bloqueado: pagamento pendente")
	// }

	// 2. Fetch the user's specific panel configuration from the 'paineis' table.
	// Mocking the response for now based on the "BUILD" plan.
	mockPainel := &PainelResponse{
		Plano:  "BUILD",
		Status: "ativo",
		Modulos: []string{
			"visao-geral",
			"diagnostico",
			"roadmap",
			"arquitetura",
			"consultoria",
			"documentos",
			"suporte",
		},
	}

	if mockPainel.Status == "bloqueado" {
		return nil, errors.New("acesso ao painel bloqueado")
	}

	return mockPainel, nil
}
