package core

import "context"

// UserStatus defines the possible states of a user's project.
// This should align with the 'status' field in the 'users' table.
type UserStatus string

const (
	UserStatusDiagnostico UserStatus = "diagnostico"        // This represents a user who is in the diagnostic flow.
	UserStatusPagamento   UserStatus = "pagamento_pendente" // This represents a user who has finished diagnosis and needs to pay.
	UserStatusAtivo       UserStatus = "ativo"              // This represents a user who has paid and has access.
)

// ProjectStatus represents the data contract returned by the core backend.
// It summarizes a user's current state in the Tech Lab platform.
type ProjectStatus struct {
	UserID   string     `json:"id"`
	Email    string     `json:"email"`
	Status   UserStatus `json:"status"`
	NextStep string     `json:"flow"` // "diagnostico", "pagamento", or "painel"
}

// CoreClient defines the interface for communicating with the main backend API.
// This abstraction allows swapping the real HTTP client with a mock for testing.
type CoreClient interface {
	GetProjectStatusByEmail(ctx context.Context, email string) (*ProjectStatus, error)
}
