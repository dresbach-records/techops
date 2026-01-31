package email

import (
	"fmt"
	"log"
	"os"

	"github.com/resend/resend-go/v3"
)

// ResendService is an implementation of EmailService using the Resend API.
type ResendService struct {
	client *resend.Client
	from   string
	apiKey string
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

	client := resend.NewClient(apiKey)

	return &ResendService{
		client: client,
		from:   from,
		apiKey: apiKey,
	}, nil
}

// Send sends an email using the Resend API.
func (r *ResendService) Send(to, subject, htmlBody string) error {
	// Temporarily disabled to avoid rate limit errors during testing.
	// The system will log the email that would have been sent.
	log.Printf("--- SIMULATING EMAIL (Real sending is temporarily disabled) ---\n")
	log.Printf("From: %s\n", r.from)
	log.Printf("To: %s\n", to)
	log.Printf("Subject: %s\n", subject)
	log.Printf("Body: (HTML content not shown)\n")
	log.Printf("---------------------------------\n")
	return nil
}
