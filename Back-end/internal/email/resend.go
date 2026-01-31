package email

import (
	"fmt"
	"log"
	"os"
)

// ResendService is an implementation of EmailService using the Resend API.
type ResendService struct {
	apiKey string
	from   string
}

// NewResendService creates a new instance of ResendService.
// It reads the API key and from address from environment variables.
func NewResendService() (*ResendService, error) {
	apiKey := os.Getenv("RESEND_API_KEY")
	if apiKey == "" || apiKey == "CHANGE_ME" {
		log.Println("Warning: RESEND_API_KEY not set, email sending will be simulated.")
	}

	from := os.Getenv("EMAIL_FROM")
	if from == "" {
		return nil, fmt.Errorf("EMAIL_FROM environment variable not set")
	}

	return &ResendService{
		apiKey: apiKey,
		from:   from,
	}, nil
}

// Send simulates sending an email using the Resend API.
// In a real implementation, this would make an HTTP POST request to https://api.resend.com/emails
func (r *ResendService) Send(to, subject, htmlBody string) error {
	log.Printf("--- SIMULATING EMAIL (Resend) ---\n")
	log.Printf("From: %s\n", r.from)
	log.Printf("To: %s\n", to)
	log.Printf("Subject: %s\n", subject)
	log.Printf("Body: (HTML content not shown)\n")
	log.Printf("---------------------------------\n")

	if r.apiKey == "" || r.apiKey == "CHANGE_ME" {
		log.Println("Email not sent because RESEND_API_KEY is not configured.")
		// In a real app, you might want to return an error here
		// but for simulation, we'll just log and proceed.
		return nil
	}

	// Placeholder for the actual HTTP call to Resend API
	// e.g., using net/http to POST to https://api.resend.com/emails

	return nil
}
