package core

import (
	"context"
	"encoding/json"
	"fmt"
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
			Timeout: 5 * time.Second,
		},
	}
}

// GetProjectStatusByEmail fetches the user's current status from the core API.
// NOTE: This assumes a new endpoint `/v1/users/by-email` will be created in the core API.
func (c *HTTPClient) GetProjectStatusByEmail(
	ctx context.Context,
	email string,
) (*ProjectStatus, error) {

	// This endpoint needs to be created in the main Go backend.
	u := fmt.Sprintf("%s/v1/users/by-email?email=%s",
		c.baseURL,
		url.QueryEscape(email),
	)

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, u, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+c.apiKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to execute request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusNotFound {
		return nil, fmt.Errorf("user_not_found")
	}

	if resp.StatusCode >= 400 {
		var errorBody interface{}
		json.NewDecoder(resp.Body).Decode(&errorBody)
		return nil, fmt.Errorf("core_api_error status %d: %v", resp.StatusCode, errorBody)
	}

	var out ProjectStatus
	if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	return &out, nil
}
