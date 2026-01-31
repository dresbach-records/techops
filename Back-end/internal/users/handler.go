package users

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Handler holds the services required by the user handlers.
type Handler struct {
	repo Repository
}

// NewHandler creates a new user handler.
func NewHandler(r Repository) *Handler {
	return &Handler{repo: r}
}

// GetMe returns the details of the currently authenticated user based on the UserMeResponse contract.
func (h *Handler) GetMe(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User ID not found in token context"})
		return
	}

	id, ok := userID.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid User ID format in token context"})
		return
	}

	user, err := h.repo.FindByID(id)
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
		Flow:   user.FlowStep, // Map internal DB field name to public contract name
	}

	c.JSON(http.StatusOK, response)
}
