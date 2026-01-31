package core

import (
	"bytes"
	"context"
	"crypto/rand"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"time"
)

// HTTPClient is the real implementation of CoreClient for communicating with the backend.
type HTTPClient struct {
	baseURL string
	apiKey  string
	client  *http.Client
}

// NewHTTPClient creates a new, configured HTTP client for the core API.
func NewHTTPClient(baseURL, apiKey string) CoreClient {
	return &HTTPClient{
		baseURL: baseURL,
		apiKey:  apiKey,
		client: &http.Client{
			Timeout: 5 * time.Second, // Use BOT_TIMEOUT_MS from .env in a real scenario
		},
	}
}

// newRequestID generates a simple pseudo-random request ID.
func newRequestID() string {
	b := make([]byte, 16)
	rand.Read(b)
	return fmt.Sprintf("%x", b)
}

// doRequest is a helper to execute HTTP requests to the core API.
func (c *HTTPClient) doRequest(ctx context.Context, method, path string, output interface{}) error {
	requestID := newRequestID()
	u := c.baseURL + path

	req, err := http.NewRequestWithContext(ctx, method, u, nil)
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+c.apiKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Source", "techlab-bot")
	req.Header.Set("X-Request-Id", requestID)

	log.Printf("INFO: CoreClient request [%s] to %s %s", requestID, method, u)
	startTime := time.Now()

	resp, err := c.client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to execute request: %w", err)
	}
	defer resp.Body.Close()

	latency := time.Since(startTime)
	log.Printf("INFO: CoreClient response [%s] from %s %s -> Status: %d, Latency: %s", requestID, method, u, resp.StatusCode, latency)

	if resp.StatusCode == http.StatusNotFound {
		return fmt.Errorf("user_not_found")
	}

	body, _ := io.ReadAll(resp.Body)
	// Reset body for JSON decoder
	resp.Body = io.NopCloser(bytes.NewBuffer(body))

	if resp.StatusCode >= 400 {
		return fmt.Errorf("core_api_error status %d: %s", resp.StatusCode, string(body))
	}

	if output != nil {
		if err := json.NewDecoder(resp.Body).Decode(output); err != nil {
			return fmt.Errorf("failed to decode response: %w", err)
		}
	}

	return nil
}


// GetProjectStatusByEmail fetches the user's current status from the core API.
func (c *HTTPClient) GetProjectStatusByEmail(
	ctx context.Context,
	email string,
) (*ProjectStatus, error) {
	var out ProjectStatus
	path := fmt.Sprintf("/v1/users/by-email?email=%s", url.QueryEscape(email))
	err := c.doRequest(ctx, http.MethodGet, path, &out)
	if err != nil {
		return nil, err
	}
	return &out, nil
}

// GetPagamentoStatus fetches a user's payment status and checkout link.
func (c *HTTPClient) GetPagamentoStatus(
	ctx context.Context,
	userID string,
) (*PagamentoStatus, error) {
	var out PagamentoStatus
	path := fmt.Sprintf("/v1/pagamentos/status?user_id=%s", url.QueryEscape(userID))
	err := c.doRequest(ctx, http.MethodGet, path, &out)
	if err != nil {
		return nil, err
	}
	return &out, nil
}

// GetPainelStatus fetches a user's panel URL.
func (c *HTTPClient) GetPainelStatus(
	ctx context.Context,
	userID string,
) (*PainelStatus, error) {
	var out PainelStatus
	path := fmt.Sprintf("/v1/cliente/painel?user_id=%s", url.QueryEscape(userID))
	err := c.doRequest(ctx, http.MethodGet, path, &out)
	if err != nil {
		return nil, err
	}
	return &out, nil
}
