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

	// For now, we get the name from the JWT claim for the welcome message
	userName, _ := c.Get("userName")
	if userName == nil {
		userName = "Usuário" // Fallback
	}

	// The user ID is passed for future use (e.g., fetching user-specific data).
	dashboardData, err := BuildForUser(userID.(string), userName.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to build dashboard"})
		return
	}

	c.JSON(http.StatusOK, dashboardData)
}
