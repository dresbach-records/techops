package painel

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Handler holds the services required by the painel handlers.
type Handler struct {
	service Service
}

// NewHandler creates a new painel handler.
func NewHandler(s Service) *Handler {
	return &Handler{service: s}
}

// GetPainel returns the dashboard data for the authenticated user.
func (h *Handler) GetPainel(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User ID not found in context"})
		return
	}

	painelData, err := h.service.BuildForUser(userID.(string))
	if err != nil {
		// This will catch "access blocked" errors from the service.
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, painelData)
}
