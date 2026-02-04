package auth

import (
	"context"
	"crypto/rsa"
	"crypto/x509"
	"encoding/json"
	"encoding/pem"
	"fmt"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

const (
	googlePublicKeysURL = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"
)

var (
	publicKeys     map[string]*rsa.PublicKey
	mu             sync.RWMutex
	keysLastUpdate time.Time
)

// fetchPublicKeys retrieves and parses Google's public keys for verifying Firebase ID tokens.
func fetchPublicKeys() (map[string]*rsa.PublicKey, error) {
	resp, err := http.Get(googlePublicKeysURL)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to fetch public keys: status %d", resp.StatusCode)
	}

	var keys map[string]string
	if err := json.NewDecoder(resp.Body).Decode(&keys); err != nil {
		return nil, err
	}

	parsedKeys := make(map[string]*rsa.PublicKey)
	for kid, certPEM := range keys {
		block, _ := pem.Decode([]byte(certPEM))
		if block == nil {
			return nil, fmt.Errorf("failed to decode PEM block for kid: %s", kid)
		}
		cert, err := x509.ParseCertificate(block.Bytes)
		if err != nil {
			return nil, fmt.Errorf("failed to parse certificate for kid %s: %w", kid, err)
		}
		rsaPubKey, ok := cert.PublicKey.(*rsa.PublicKey)
		if !ok {
			return nil, fmt.Errorf("public key for kid %s is not an RSA key", kid)
		}
		parsedKeys[kid] = rsaPubKey
	}

	return parsedKeys, nil
}

// getKey returns a public key for a given key ID (kid), fetching and caching as needed.
func getKey(kid string) (*rsa.PublicKey, error) {
	mu.RLock()
	// Refresh keys every hour to handle key rotation
	if time.Since(keysLastUpdate) > time.Hour {
		mu.RUnlock() // Unlock for writing
		mu.Lock()
		defer mu.Unlock()
		// Recheck condition after acquiring write lock
		if time.Since(keysLastUpdate) > time.Hour {
			keys, err := fetchPublicKeys()
			if err != nil {
				return nil, fmt.Errorf("failed to refresh public keys: %w", err)
			}
			publicKeys = keys
			keysLastUpdate = time.Now()
		}
	} else {
		defer mu.RUnlock()
	}

	key, found := publicKeys[kid]
	if !found {
		return nil, fmt.Errorf("public key with kid '%s' not found", kid)
	}
	return key, nil
}

// ValidateFirebaseToken parses and validates a Firebase ID token, including cryptographic signature.
func ValidateFirebaseToken(ctx context.Context, idToken string) (*jwt.Token, error) {
	projectID := os.Getenv("FIREBASE_PROJECT_ID")
	if projectID == "" {
		return nil, fmt.Errorf("FIREBASE_PROJECT_ID environment variable not set")
	}

	keyFunc := func(token *jwt.Token) (interface{}, error) {
		kid, ok := token.Header["kid"].(string)
		if !ok {
			return nil, fmt.Errorf("kid header not found in token")
		}
		// getKey fetches and caches the public keys from Google's endpoint
		return getKey(kid)
	}

	// Parse and validate the token signature.
	token, err := jwt.Parse(idToken, keyFunc)
	if err != nil {
		return nil, fmt.Errorf("token validation failed: %w", err)
	}

	if !token.Valid {
		return nil, fmt.Errorf("token is invalid")
	}

	// Additionally, validate standard claims for Firebase tokens.
	issuer := "https://securetoken.google.com/" + projectID

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, fmt.Errorf("invalid token claims")
	}

	if err := jwt.NewValidator(
		jwt.WithIssuer(issuer),
		jwt.WithAudience(projectID),
		jwt.WithLeeway(5*time.Second),
	).Validate(claims); err != nil {
		return nil, fmt.Errorf("token claim validation failed: %w", err)
	}

	authTime, err := claims.GetAuthTime()
	if err != nil || authTime == nil || time.Since(authTime.Time) > time.Hour*24*14 { // Example: max age 14 days
		return nil, fmt.Errorf("token is too old or auth_time claim is missing")
	}

	// Subject claim must exist for a valid Firebase token.
	if _, err := claims.GetSubject(); err != nil {
		return nil, fmt.Errorf("subject (sub) claim is missing")
	}

	return token, nil
}
