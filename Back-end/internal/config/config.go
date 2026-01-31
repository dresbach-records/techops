package config

import (
	"log"
	"github.com/joho/godotenv"
)

// Load configurations from .env file.
// It's a simple helper to be called at the start of the application.
func LoadEnv(path string) {
	err := godotenv.Load(path)
	if err != nil {
		log.Printf("Warning: Could not load %s file. Relying on environment variables.", path)
	}
}
