package auth

import (
	"context"
	"net/http"
	"strings"
	"techlab/backend-go/internal/users"

	"github.com/gin-gonic/gin"
)

// AuthRequired is a middleware to protect routes that require a valid Firebase JWT.
func AuthRequired(userRepo users.Repository) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header format must be Bearer {token}"})
			return
		}

		idToken := parts[1]

		// Validate the Firebase ID token
		token, err := ValidateFirebaseToken(context.Background(), idToken)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token: " + err.Error()})
			return
		}

		claims, ok := token.Claims.(map[string]interface{})
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			return
		}

		// Set Firebase claims in context for handlers that need them (like user registration)
		c.Set("firebase_uid", claims["user_id"])
		c.Set("firebase_email", claims["email"])

		// For existing routes, resolve the internal user and set their ID in the context
		email, _ := claims["email"].(string)
		if email != "" {
			user, err := userRepo.FindByEmail(email)
			// If the user exists in our DB, set their internal context for other handlers.
			if err == nil && user != nil {
				c.Set("userID", user.ID)
				c.Set("userName", user.Nome)
				c.Set("userEmail", user.Email)
				c.Set("userRole", user.Role)
			}
		}

		c.Next()
	}
}
