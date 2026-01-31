package auth

import (
	"errors"
	"fmt"
	"os"
	"techlab/backend-go/internal/users"
	"techlab/backend-go/pkg/security"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// Service provides authentication-related business logic.
type Service interface {
	Register(name, email, password string) (string, error)
	Login(email, password string) (string, error)
}

type service struct {
	userRepo  users.Repository
	jwtSecret string
}

// NewService creates a new authentication service.
func NewService(repo users.Repository) (Service, error) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return nil, errors.New("JWT_SECRET environment variable not set")
	}
	return &service{userRepo: repo, jwtSecret: secret}, nil
}

// Register creates a new user, hashes their password, and returns a JWT.
func (s *service) Register(name, email, password string) (string, error) {
	// Check if user already exists
	if _, err := s.userRepo.FindByEmail(email); err == nil {
		return "", errors.New("user with this email already exists")
	}

	hashedPassword, err := security.HashPassword(password)
	if err != nil {
		return "", fmt.Errorf("could not hash password: %w", err)
	}

	user := users.User{
		Name:         name,
		Email:        email,
		PasswordHash: hashedPassword,
		Role:         "cliente", // Default role
	}

	savedUser, err := s.userRepo.Save(user)
	if err != nil {
		return "", fmt.Errorf("could not save user: %w", err)
	}

	return s.generateJWT(savedUser)
}

// Login verifies a user's credentials and returns a JWT.
func (s *service) Login(email, password string) (string, error) {
	user, err := s.userRepo.FindByEmail(email)
	if err != nil {
		return "", errors.New("invalid credentials")
	}

	if !security.CheckPasswordHash(password, user.PasswordHash) {
		return "", errors.New("invalid credentials")
	}

	return s.generateJWT(user)
}

// generateJWT creates a new JWT for a given user.
func (s *service) generateJWT(user *users.User) (string, error) {
	claims := jwt.MapClaims{
		"sub":   user.ID,
		"name":  user.Name,
		"email": user.Email,
		"role":  user.Role,
		"exp":   time.Now().Add(time.Hour * 72).Unix(),
		"iat":   time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString([]byte(s.jwtSecret))
	if err != nil {
		return "", fmt.Errorf("failed to sign token: %w", err)
	}

	return tokenString, nil
}
