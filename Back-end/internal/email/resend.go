package email

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
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

// Send sends an email using the Resend API.
func (r *ResendService) Send(to, subject, htmlBody string) error {
	// If API key is not set, simulate the email for development/testing.
	if r.apiKey == "" || r.apiKey == "CHANGE_ME" {
		log.Printf("--- SIMULATING EMAIL (Resend - API Key not configured) ---\n")
		log.Printf("From: %s\n", r.from)
		log.Printf("To: %s\n", to)
		log.Printf("Subject: %s\n", subject)
		log.Printf("Body: (HTML content not shown)\n")
		log.Printf("---------------------------------\n")
		log.Println("Email not sent because RESEND_API_KEY is not configured.")
		return nil // Don't return an error for simulation purposes
	}

	apiURL := "https://api.resend.com/emails"

	payload := map[string]interface{}{
		"from":    r.from,
		"to":      []string{to},
		"subject": subject,
		"html":    htmlBody,
	}

	jsonPayload, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("failed to marshal email payload: %w", err)
	}

	req, err := http.NewRequest("POST", apiURL, bytes.NewBuffer(jsonPayload))
	if err != nil {
		return fmt.Errorf("failed to create http request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+r.apiKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send email request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 300 {
		body, _ := io.ReadAll(resp.Body)
		// The caller should handle logging.
		return fmt.Errorf("failed to send email, status: %s, response: %s", resp.Status, string(body))
	}

	log.Printf("Successfully sent email to %s via Resend.", to)
	return nil
}
