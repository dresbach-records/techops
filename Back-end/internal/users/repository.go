package users

import (
	"database/sql"
	"fmt"
	"time"
)

// Repository provides access to the user storage.
type Repository interface {
	Save(user User) (*User, error)
	FindByEmail(email string) (*User, error)
	FindByID(id string) (*User, error)
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
		INSERT INTO users (name, email, password_hash, role) 
		VALUES ($1, $2, $3, $4) 
		RETURNING id, created_at, updated_at
	`
	err := r.db.QueryRow(query, user.Name, user.Email, user.PasswordHash, user.Role).Scan(&user.ID, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("could not save user: %w", err)
	}
	return &user, nil
}

// FindByEmail finds a user by their email address.
func (r *repository) FindByEmail(email string) (*User, error) {
	query := `
		SELECT id, name, email, password_hash, role, created_at, updated_at
		FROM users
		WHERE email = $1
	`
	var user User
	err := r.db.QueryRow(query, email).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.PasswordHash,
		&user.Role,
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
		SELECT id, name, email, password_hash, role, created_at, updated_at
		FROM users
		WHERE id = $1
	`
	var user User
	err := r.db.QueryRow(query, id).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.PasswordHash,
		&user.Role,
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
