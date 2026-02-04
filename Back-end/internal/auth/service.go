package auth

import "techlab/backend-go/internal/users"

// This file is now mostly obsolete as auth logic is handled by Firebase.
// The middleware is the key part that remains. We keep the file for the service struct if needed.

// Service provides authentication-related business logic.
type Service interface {
	// Register and Login are now handled by Firebase.
}

type service struct {
	userRepo users.Repository
}

// NewService creates a new authentication service.
func NewService(repo users.Repository) (Service, error) {
	return &service{userRepo: repo}, nil
}
