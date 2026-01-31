package main

import (
	"log"
	"os"
	"techlab/backend-go/internal/config"
	"techlab/backend-go/internal/server"
	"techlab/backend-go/pkg/db"
)

func main() {
	// Load environment variables from .env file
	config.LoadEnv("Back-end/.env")

	// Initialize database connection
	database, err := db.Connect()
	if err != nil {
		log.Fatalf("❌ DB configuration failed: %v", err)
	}
	defer database.Close()

	// Ping the database to verify the connection is alive before starting.
	if err := database.Ping(); err != nil {
		log.Fatalf("❌ DB connection failed: %v", err)
	}
	log.Println("✅ Successfully connected to the Supabase database.")

	// Create a new server, passing the database connection
	srv := server.NewServer(database)

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
