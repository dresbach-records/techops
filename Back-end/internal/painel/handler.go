package painel

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Handler holds the services required by the painel handlers.
type Handler struct {
	// No services needed for now, as data is hardcoded
}

// NewHandler creates a new painel handler.
func NewHandler() *Handler {
	return &Handler{}
}

// GetDashboard returns the dashboard data for the authenticated user.
func (h *Handler) GetDashboard(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User ID not found in context"})
		return
	}

	userName, _ := c.Get("userName")
	if userName == nil {
		userName = "Usuário" // Fallback
	}

	dashboardData, err := BuildForUser(userID.(string), userName.(string))
	if err != nil {
		// Handle access denied error from the builder.
		// This enforces the "gate" for dashboard access.
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, dashboardData)
}
