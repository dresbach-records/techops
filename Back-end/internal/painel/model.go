package painel

import (
	"time"

	"github.com/lib/pq"
)

// PainelResponse is the contract for GET /cliente/painel
type PainelResponse struct {
	Plano   string   `json:"plano"`
	Status  string   `json:"status"`
	Modulos []string `json:"modulos"`
}

// Painel represents a user's dashboard configuration in the database.
type Painel struct {
	ID            string         `db:"id"`
	UserID        string         `db:"user_id"`
	PlanoCodigo   string         `db:"plano_codigo"`
	Status        string         `db:"status"`
	ModulosAtivos pq.StringArray `db:"modulos_ativos"`
	CreatedAt     time.Time      `db:"created_at"`
	UpdatedAt     time.Time      `db:"updated_at"`
}
