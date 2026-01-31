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

// GetMe returns the details of the currently authenticated user.
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

	c.JSON(http.StatusOK, user)
}
