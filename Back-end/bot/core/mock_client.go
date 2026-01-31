package core

import (
	"context"
	"fmt"
	"strings"
)

// MockClient is a mock implementation of CoreClient for development and testing.
type MockClient struct{}

// NewMockClient creates a new mock client.
func NewMockClient() CoreClient {
	return &MockClient{}
}

// GetProjectStatusByEmail simulates fetching user status based on the email address.
func (m *MockClient) GetProjectStatusByEmail(
	ctx context.Context,
	email string,
) (*ProjectStatus, error) {

	// This mock logic matches the one previously in flows.go for consistency.
	switch {
	case strings.Contains(email, "ativo"), strings.Contains(email, "pago"):
		return &ProjectStatus{
			UserID:   "mock-uuid-1",
			Email:    email,
			Status:   UserStatusAtivo,
			NextStep: "painel",
		}, nil

	case strings.Contains(email, "pagamento"):
		return &ProjectStatus{
			UserID:   "mock-uuid-2",
			Email:    email,
			Status:   UserStatusPagamento,
			NextStep: "pagamento",
		}, nil

	case strings.Contains(email, "notfound"):
		return nil, fmt.Errorf("user_not_found")

	default:
		return &ProjectStatus{
			UserID:   "mock-uuid-3",
			Email:    email,
			Status:   UserStatusDiagnostico, // This status is conceptual for the bot's FSM
			NextStep: "diagnostico",
		}, nil
	}
}
