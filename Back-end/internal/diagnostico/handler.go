package diagnostico

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Handler holds the services required by the diagnostico handlers.
type Handler struct {
	service Service
}

// NewHandler creates a new diagnostico handler.
func NewHandler(s Service) *Handler {
	return &Handler{service: s}
}

// GetResultadoHandler handles the request to get the recommended plan.
func (h *Handler) GetResultadoHandler(c *gin.Context) {
	// In a real scenario, we might use the user ID from the token
	// to find the correct diagnosis result.
	// userID, _ := c.Get("userID")

	result, err := h.service.GetResultado("some-user-id") // Using a placeholder ID
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get diagnostic result"})
		return
	}

	c.JSON(http.StatusOK, result)
}
