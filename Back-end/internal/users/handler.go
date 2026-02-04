package users

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Handler holds the services required by the user handlers.
type Handler struct {
	service Service
}

// NewHandler creates a new user handler.
func NewHandler(s Service) *Handler {
	return &Handler{service: s}
}

// RegisterRequest defines the expected JSON for user registration.
type RegisterRequest struct {
	Nome string `json:"nome" binding:"required,min=2"`
}

// Register handles creation of a new user profile after Firebase registration.
func (h *Handler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: " + err.Error()})
		return
	}

	// Get user details from token claims, placed by the middleware
	firebaseUID, _ := c.Get("firebase_uid")
	email, _ := c.Get("firebase_email")

	if firebaseUID.(string) == "" || email.(string) == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims for registration"})
		return
	}

	user, err := h.service.Register(req.Nome, email.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, user)
}

// GetMe returns the details of the currently authenticated user.
func (h *Handler) GetMe(c *gin.Context) {
	// The middleware already resolved the token to our internal user ID
	userID, exists := c.Get("userID")
	if !exists {
		// This can happen if the user is in Firebase but not yet in our DB.
		c.JSON(http.StatusNotFound, gin.H{"error": "User profile not found in our system."})
		return
	}

	id, ok := userID.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid User ID format in token context"})
		return
	}

	user, err := h.service.FindByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Map the internal User model to the public UserMeResponse contract
	response := UserMeResponse{
		ID:     user.ID,
		Nome:   user.Nome,
		Email:  user.Email,
		Role:   user.Role,
		Status: user.Status,
		Flow:   user.FlowStep,
	}

	c.JSON(http.StatusOK, response)
}
