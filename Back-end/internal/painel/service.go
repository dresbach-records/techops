package painel

import (
	"errors"
	"fmt"
	"techlab/backend-go/internal/users"
)

// Service defines the business logic for the painel.
type Service interface {
	BuildForUser(userID string) (*PainelResponse, error)
}

type service struct {
	painelRepo Repository
	userRepo   users.Repository
}

// NewService creates a new painel service.
func NewService(pr Repository, ur users.Repository) Service {
	return &service{
		painelRepo: pr,
		userRepo:   ur,
	}
}

// BuildForUser constructs the dashboard data for a specific user.
// This function is the core of the backend-driven dashboard.
func (s *service) BuildForUser(userID string) (*PainelResponse, error) {
	// 1. Check user status first. This is a critical security gate.
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}

	if user.Status != "ativo" {
		// Use a generic error to avoid leaking user status details.
		return nil, errors.New("acesso ao painel bloqueado")
	}

	// 2. Fetch the user's specific panel configuration from the 'paineis' table.
	painel, err := s.painelRepo.FindByUserID(userID)
	if err != nil {
		// This could mean the panel wasn't created yet after payment.
		// For now, we return an error. In a real scenario, we might try to create it here.
		return nil, fmt.Errorf("painel configuration not found for user: %w", err)
	}

	// 3. Map the database model to the API response contract.
	response := &PainelResponse{
		Plano:   painel.PlanoCodigo,
		Status:  painel.Status,
		Modulos: painel.ModulosAtivos,
	}

	if response.Status == "bloqueado" {
		return nil, errors.New("acesso ao painel bloqueado")
	}

	return response, nil
}
