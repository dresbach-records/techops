package diagnostico

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// RecommendPlanHandler handles the request to recommend a plan.
func RecommendPlanHandler(c *gin.Context) {
	var req RecommendPlanRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload: " + err.Error()})
		return
	}

	plan := CalculatePlan(req)

	c.JSON(http.StatusOK, plan)
}