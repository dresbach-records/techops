package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

const graphAPIURL = "https://graph.facebook.com/v20.0/"

// WhatsAppClient defines the interface for sending messages.
type WhatsAppClient interface {
	SendTextMessage(to, body string) error
}

// httpWhatsAppClient is the implementation of WhatsAppClient.
type httpWhatsAppClient struct {
	whatsappToken string
	phoneNumberID string
	httpClient    *http.Client
}

// NewWhatsAppClient creates a new client for the WhatsApp Graph API.
func NewWhatsAppClient(whatsappToken, phoneNumberID string) WhatsAppClient {
	return &httpWhatsAppClient{
		whatsappToken: whatsappToken,
		phoneNumberID: phoneNumberID,
		httpClient:    &http.Client{},
	}
}

// SendTextMessage sends a plain text message to a user.
func (c *httpWhatsAppClient) SendTextMessage(to, body string) error {
	if c.whatsappToken == "" || c.phoneNumberID == "" {
		log.Println("WARNING: WhatsApp tokens not set. Simulating message sending.")
		log.Printf("--- SIMULATING WHATSAPP MESSAGE ---\n")
		log.Printf("To: %s\n", to)
		log.Printf("Body: %s\n", body)
		log.Printf("----------------------------------\n")
		return nil // Simulate success if tokens are not set
	}

	url := fmt.Sprintf("%s%s/messages", graphAPIURL, c.phoneNumberID)

	requestBody := WhatsAppAPIRequest{
		MessagingProduct: "whatsapp",
		To:               to,
		Type:             "text",
	}
	requestBody.Text.Body = body

	jsonBody, err := json.Marshal(requestBody)
	if err != nil {
		return fmt.Errorf("failed to marshal request body: %w", err)
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonBody))
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+c.whatsappToken)
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 300 {
		var errorResp interface{}
		json.NewDecoder(resp.Body).Decode(&errorResp)
		return fmt.Errorf("whatsapp API returned status %d: %v", resp.StatusCode, errorResp)
	}

	log.Printf("Successfully sent message to %s", to)
	return nil
}
