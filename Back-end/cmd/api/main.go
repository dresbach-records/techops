package main

import (
	"log"
	"os"
	"techlab/backend-go/internal/config"
	"techlab/backend-go/internal/server"
)

func main() {
	// Load environment variables from .env file
	config.LoadEnv("Back-end/.env")

	// Create a new server
	srv := server.NewServer()

	// Get port from environment or use default
	port := os.Getenv("API_PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Backend server starting on http://localhost:%s", port)

	// Start the server
	if err := srv.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
