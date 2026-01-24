package main

import (
	"backend/internal/router"
	"context"
	"log"
	"os"

	"github.com/go-redis/redis/v8"
	"github.com/joho/godotenv"

	"github.com/golang-migrate/migrate/v4"

	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func main() {
	_ = godotenv.Load()

	dbURL := os.Getenv("DATABASE_URL")
	m, err := migrate.New("file://migrations", dbURL)
	if err == nil {
		m.Up()
	}

	PORT := os.Getenv("PORT")
	rdb := redis.NewClient(&redis.Options{
		Addr: os.Getenv("REDIS_URL_SETUP"),
	})

	if err := rdb.Ping(context.Background()).Err(); err != nil {
		log.Fatalf("Redis connection failed: %v", err)
	}

	r := router.Setup(rdb)

	if err := r.Run(PORT); err != nil {
		log.Fatalf("Not running")
	}

	log.Println("Server running on ", PORT)

}
