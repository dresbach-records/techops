package pagamento

import (
	"database/sql"
	"fmt"
)

// Repository provides access to the payment storage.
type Repository interface {
	Save(p *Pagamento) error
	FindByProviderID(providerID string) (*Pagamento, error)
	UpdateStatus(id string, status string) error
}

type repository struct {
	db *sql.DB
}

// NewRepository creates a new payment repository.
func NewRepository(db *sql.DB) Repository {
	return &repository{db: db}
}

// Save creates a new payment record in the database.
func (r *repository) Save(p *Pagamento) error {
	query := `
        INSERT INTO pagamentos (user_id, plano_codigo, valor, metodo, status, provider, provider_id, checkout_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, created_at, updated_at`

	return r.db.QueryRow(
		query,
		p.UserID,
		p.PlanoCodigo,
		p.Valor,
		p.Metodo,
		p.Status,
		p.Provider,
		p.ProviderID,
		p.CheckoutURL,
	).Scan(&p.ID, &p.CreatedAt, &p.UpdatedAt)
}

// FindByProviderID finds a payment record by the payment provider's unique ID.
func (r *repository) FindByProviderID(providerID string) (*Pagamento, error) {
	var p Pagamento
	query := `
        SELECT id, user_id, plano_codigo, valor, metodo, status, provider, provider_id, checkout_url, created_at, updated_at
        FROM pagamentos
        WHERE provider_id = $1`

	err := r.db.QueryRow(query, providerID).Scan(
		&p.ID,
		&p.UserID,
		&p.PlanoCodigo,
		&p.Valor,
		&p.Metodo,
		&p.Status,
		&p.Provider,
		&p.ProviderID,
		&p.CheckoutURL,
		&p.CreatedAt,
		&p.UpdatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("payment with provider ID %s not found", providerID)
		}
		return nil, err
	}
	return &p, nil
}

// UpdateStatus updates the status of a payment record.
func (r *repository) UpdateStatus(id string, status string) error {
	query := `UPDATE pagamentos SET status = $1, updated_at = now() WHERE id = $2`
	_, err := r.db.Exec(query, status, id)
	return err
}
