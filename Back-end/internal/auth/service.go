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

// LoginResponse is the contract for a successful login or registration.
type LoginResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"` // Not implemented yet, returning empty
	ExpiresIn    int    `json:"expires_in"`
}

// Service provides authentication-related business logic.
type Service interface {
	Register(nome, email, password string) (*LoginResponse, error)
	Login(email, password string) (*LoginResponse, error)
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

// Register creates a new user, hashes their password, and returns a JWT response.
func (s *service) Register(nome, email, password string) (*LoginResponse, error) {
	// Check if user already exists
	if _, err := s.userRepo.FindByEmail(email); err == nil {
		return nil, errors.New("user with this email already exists")
	}

	hashedPassword, err := security.HashPassword(password)
	if err != nil {
		return nil, fmt.Errorf("could not hash password: %w", err)
	}

	user := users.User{
		Nome:         nome,
		Email:        email,
		PasswordHash: hashedPassword,
		Role:         "cliente",            // Default role
		Status:       "pagamento_pendente", // Default status
		Flow:         "diagnostico",        // Default flow
	}

	savedUser, err := s.userRepo.Save(user)
	if err != nil {
		return nil, fmt.Errorf("could not save user: %w", err)
	}

	return s.generateJWTResponse(savedUser)
}

// Login verifies a user's credentials and returns a JWT response.
func (s *service) Login(email, password string) (*LoginResponse, error) {
	user, err := s.userRepo.FindByEmail(email)
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	if !security.CheckPasswordHash(password, user.PasswordHash) {
		return nil, errors.New("invalid credentials")
	}

	return s.generateJWTResponse(user)
}

// generateJWTResponse creates the full login response for a user
func (s *service) generateJWTResponse(user *users.User) (*LoginResponse, error) {
	accessToken, expiresIn, err := s.generateJWT(user)
	if err != nil {
		return nil, err
	}

	return &LoginResponse{
		AccessToken:  accessToken,
		RefreshToken: "", // Refresh tokens are out of scope for now
		ExpiresIn:    expiresIn,
	}, nil
}

// generateJWT creates a new JWT for a given user.
func (s *service) generateJWT(user *users.User) (string, int, error) {
	expiresIn := 3600 * 24 // 24 hours
	expirationTime := time.Now().Add(time.Duration(expiresIn) * time.Second)

	claims := jwt.MapClaims{
		"sub":   user.ID,
		"nome":  user.Nome,
		"email": user.Email,
		"role":  user.Role,
		"exp":   expirationTime.Unix(),
		"iat":   time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString([]byte(s.jwtSecret))
	if err != nil {
		return "", 0, fmt.Errorf("failed to sign token: %w", err)
	}

	return tokenString, expiresIn, nil
}
