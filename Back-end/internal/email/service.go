package email

// EmailService defines the interface for sending emails.
// This allows for different email provider implementations (e.g., Resend, SES).
type EmailService interface {
	Send(to, subject, htmlBody string) error
}
