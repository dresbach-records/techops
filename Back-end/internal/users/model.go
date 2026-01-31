package users

import (
	"time"
)

// User represents a user in the system, mapping to the 'users' table.
// It's the internal representation, used by the repository.
type User struct {
	ID           string    `json:"id"`
	Nome         string    `json:"nome"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	Role         string    `json:"role"`
	Status       string    `json:"status"`
	FlowStep     string    `json:"flow_step"` // DB column is 'flow_step'
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// UserMeResponse defines the structure returned by the /users/me endpoint.
// It's the public contract.
type UserMeResponse struct {
	ID     string `json:"id"`
	Nome   string `json:"nome"`
	Email  string `json:"email"`
	Role   string `json:"role"`
	Status string `json:"status"`
	Flow   string `json:"flow"`
}
