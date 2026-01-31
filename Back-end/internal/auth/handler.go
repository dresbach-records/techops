package auth

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// RegisterRequest defines the expected JSON for user registration.
type RegisterRequest struct {
	Name     string `json:"name" binding:"required,min=2"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
}

// LoginRequest defines the expected JSON for user login.
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// Handler holds the services required by the auth handlers.
type Handler struct {
	service Service
}

// NewHandler creates a new auth handler.
func NewHandler(s Service) *Handler {
	return &Handler{service: s}
}

// Register handles new user registration.
func (h *Handler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: " + err.Error()})
		return
	}

	token, err := h.service.Register(req.Name, req.Email, req.Password)
	if err != nil {
		// In a real app, you'd check the error type to return more specific messages
		// (e.g., email already exists).
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"token": token})
}

// Login handles user authentication.
func (h *Handler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: " + err.Error()})
		return
	}

	token, err := h.service.Login(req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}
