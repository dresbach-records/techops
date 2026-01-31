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

// ProjectStatus represents the data contract returned by the core backend for user status.
type ProjectStatus struct {
	UserID   string     `json:"user_id"`
	Email    string     `json:"email"`
	Status   UserStatus `json:"status"`
	NextStep string     `json:"next_step"` // "diagnostico", "pagamento", or "painel"
}

// PagamentoStatus represents the data contract for a user's payment status.
type PagamentoStatus struct {
	Status      string `json:"status"`
	CheckoutURL string `json:"checkout_url"`
}

// PainelStatus represents the data contract for a user's panel status.
type PainelStatus struct {
	Status string `json:"status"`
	URL    string `json:"url"`
}

// CoreClient defines the interface for communicating with the main backend API.
// This abstraction allows swapping the real HTTP client with a mock for testing.
type CoreClient interface {
	GetProjectStatusByEmail(ctx context.Context, email string) (*ProjectStatus, error)
	GetPagamentoStatus(ctx context.Context, userID string) (*PagamentoStatus, error)
	GetPainelStatus(ctx context.Context, userID string) (*PainelStatus, error)
	Ping(ctx context.Context) error
}
