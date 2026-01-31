package email

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type SendEmailRequest struct {
	To      string `json:"to" binding:"required,email"`
	Subject string `json:"subject" binding:"required"`
	HTML    string `json:"html" binding:"required"`
}

// SendEmailHandler handles the request to send a generic email.
func SendEmailHandler(emailService EmailService) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req SendEmailRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload: " + err.Error()})
			return
		}

		err := emailService.Send(req.To, req.Subject, req.HTML)
		if err != nil {
			log.Printf("ERROR: Failed to send email via handler: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send email"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Email sent successfully"})
	}
}
