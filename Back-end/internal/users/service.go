package users

import (
	"errors"
	"fmt"
)

// Service defines the business logic for user management.
type Service interface {
	Register(nome, email string) (*User, error)
	FindByID(id string) (*User, error)
}

type service struct {
	repo Repository
}

// NewService creates a new user service.
func NewService(repo Repository) Service {
	return &service{repo: repo}
}

// Register creates a new user profile in the database.
func (s *service) Register(nome, email string) (*User, error) {
	// Check if user already exists
	if _, err := s.repo.FindByEmail(email); err == nil {
		return nil, errors.New("user with this email already exists")
	}

	// Password is now handled by Firebase, so PasswordHash is empty.
	user := User{
		Nome:         nome,
		Email:        email,
		PasswordHash: "", // Password handled by Firebase
		Role:         "cliente",
		Status:       "pagamento_pendente",
		FlowStep:     "diagnostico",
	}

	savedUser, err := s.repo.Save(user)
	if err != nil {
		return nil, fmt.Errorf("could not save user: %w", err)
	}

	return savedUser, nil
}

// FindByID finds a user by their ID.
func (s *service) FindByID(id string) (*User, error) {
	return s.repo.FindByID(id)
}
