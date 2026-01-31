package db

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/jackc/pgx/v5/stdlib"
)

// Connect creates a new PostgreSQL database connection pool.
func Connect() (*sql.DB, error) {
	// Construct the connection string from Supabase environment variables
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		os.Getenv("SUPABASE_DB_HOST"),
		os.Getenv("SUPABASE_DB_PORT"),
		os.Getenv("SUPABASE_DB_USER"),
		os.Getenv("SUPABASE_DB_PASSWORD"),
		os.Getenv("SUPABASE_DB_NAME"),
		os.Getenv("SUPABASE_DB_SSLMODE"),
	)

	// Open a connection to the database using the pgx driver.
	// sql.Open() doesn't actually connect, but prepares the pool.
	db, err := sql.Open("pgx", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to configure database connection pool: %w", err)
	}

	return db, nil
}
