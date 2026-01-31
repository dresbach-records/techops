package painel

import (
	"database/sql"
	"fmt"
)

// Repository provides access to the painel storage.
type Repository interface {
	FindByUserID(userID string) (*Painel, error)
	// Save (or Create) would be here as well for when a panel is first created.
}

type repository struct {
	db *sql.DB
}

// NewRepository creates a new painel repository.
func NewRepository(db *sql.DB) Repository {
	return &repository{db: db}
}

// FindByUserID finds a user's panel configuration.
func (r *repository) FindByUserID(userID string) (*Painel, error) {
	var p Painel
	query := `
        SELECT id, user_id, plano_codigo, status, modulos_ativos, created_at, updated_at
        FROM paineis
        WHERE user_id = $1`

	err := r.db.QueryRow(query, userID).Scan(
		&p.ID,
		&p.UserID,
		&p.PlanoCodigo,
		&p.Status,
		&p.ModulosAtivos,
		&p.CreatedAt,
		&p.UpdatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			// This is a valid case if the panel has not been created yet.
			// The service layer will decide how to handle it.
			return nil, fmt.Errorf("panel not found for user %s", userID)
		}
		return nil, err
	}
	return &p, nil
}
