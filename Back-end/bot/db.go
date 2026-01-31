package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/jackc/pgx/v5/stdlib"
)

// Connect creates a new PostgreSQL database connection pool for the bot.
func Connect() (*sql.DB, error) {
	// Construct the connection string from Supabase environment variables
	// These should be in the ../.env file, shared with the main backend.
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		os.Getenv("SUPABASE_DB_HOST"),
		os.Getenv("SUPABASE_DB_PORT"),
		os.Getenv("SUPABASE_DB_USER"),
		os.Getenv("SUPABASE_DB_PASSWORD"),
		os.Getenv("SUPABASE_DB_NAME"),
		"require", // Default for Supabase connections
	)

	db, err := sql.Open("pgx", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to configure database connection pool: %w", err)
	}

	if err := db.Ping(); err != nil {
		db.Close()
		return nil, fmt.Errorf("bot DB connection failed: %w", err)
	}

	log.Println("✅ Bot successfully connected to the Supabase database.")
	return db, nil
}
