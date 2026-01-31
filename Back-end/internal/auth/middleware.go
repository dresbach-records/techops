package auth

import (
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// AuthRequired is a middleware to protect routes that require a valid JWT.
func AuthRequired() gin.HandlerFunc {
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		// This should cause a panic on startup if not set, but as a safeguard...
		panic("JWT_SECRET environment variable not set")
	}

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

		tokenString := parts[1]

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(jwtSecret), nil
		})

		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			// Check token expiration
			if exp, ok := claims["exp"].(float64); ok {
				if int64(exp) < time.Now().Unix() {
					c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token is expired"})
					return
				}
			} else {
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
				return
			}

			// Set user context, e.g., user ID and role
			c.Set("userID", claims["sub"])
			c.Set("userName", claims["name"])
			c.Set("userEmail", claims["email"])
			c.Set("userRole", claims["role"])
			c.Next()
		} else {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		}
	}
}

// RequireRole is a middleware to check for specific user roles.
// It must be used AFTER AuthRequired().
func RequireRole(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole, exists := c.Get("userRole")
		if !exists {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Role not found in token"})
			return
		}

		role, ok := userRole.(string)
		if !ok {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Invalid role format in token"})
			return
		}

		for _, r := range roles {
			if role == r {
				c.Next()
				return
			}
		}

		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "You do not have permission to access this resource"})
	}
}
