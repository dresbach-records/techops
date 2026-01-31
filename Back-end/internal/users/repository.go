package users

import (
	"database/sql"
	"fmt"
)

// Repository provides access to the user storage.
type Repository interface {
	Save(user User) (*User, error)
	FindByEmail(email string) (*User, error)
	FindByID(id string) (*User, error)
	UpdateStatusAndFlow(userID string, status string, flow string) error
}

type repository struct {
	db *sql.DB
}

// NewRepository creates a new user repository.
func NewRepository(db *sql.DB) Repository {
	return &repository{db: db}
}

// Save creates a new user in the database.
func (r *repository) Save(user User) (*User, error) {
	query := `
		INSERT INTO users (nome, email, password_hash, role, status, flow_step)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, created_at, updated_at
	`
	err := r.db.QueryRow(
		query,
		user.Nome,
		user.Email,
		user.PasswordHash,
		user.Role,
		user.Status,
		user.FlowStep,
	).Scan(&user.ID, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("could not save user: %w", err)
	}
	return &user, nil
}

// FindByEmail finds a user by their email address.
func (r *repository) FindByEmail(email string) (*User, error) {
	query := `
		SELECT id, nome, email, password_hash, role, status, flow_step, created_at, updated_at
		FROM users
		WHERE email = $1
	`
	var user User
	err := r.db.QueryRow(query, email).Scan(
		&user.ID,
		&user.Nome,
		&user.Email,
		&user.PasswordHash,
		&user.Role,
		&user.Status,
		&user.FlowStep,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("could not find user by email: %w", err)
	}
	return &user, nil
}

// FindByID finds a user by their ID.
func (r *repository) FindByID(id string) (*User, error) {
	query := `
		SELECT id, nome, email, password_hash, role, status, flow_step, created_at, updated_at
		FROM users
		WHERE id = $1
	`
	var user User
	err := r.db.QueryRow(query, id).Scan(
		&user.ID,
		&user.Nome,
		&user.Email,
		&user.PasswordHash,
		&user.Role,
		&user.Status,
		&user.FlowStep,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("could not find user by id: %w", err)
	}
	return &user, nil
}

// UpdateStatusAndFlow updates a user's status and flow step.
// This is critical for unlocking features after payment.
func (r *repository) UpdateStatusAndFlow(userID string, status string, flow string) error {
	query := `
		UPDATE users
		SET status = $2, flow_step = $3, updated_at = now()
		WHERE id = $1
	`
	result, err := r.db.Exec(query, userID, status, flow)
	if err != nil {
		return fmt.Errorf("could not update user status and flow: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("could not get affected rows: %w", err)
	}
	if rowsAffected == 0 {
		return fmt.Errorf("user with ID %s not found for update", userID)
	}

	return nil
}
