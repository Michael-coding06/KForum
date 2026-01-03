package database

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/lib/pq"
)

func Connect() *sql.DB {
	conStr := os.Getenv("DATABASE_URL")
	log.Println("Connecting to database with:", conStr)

	db, err := sql.Open("postgres", conStr)
	if err != nil {
		log.Fatal(err)
	}

	if err := db.Ping(); err != nil {
		log.Fatal(err)
	}

	log.Println("Connected to database!")
	return db
}

func Close(db *sql.DB) {
	if err := db.Close(); err != nil {
		log.Println("Error closing database:", err)
	} else {
		log.Println("Database connection closed.")
	}
}
