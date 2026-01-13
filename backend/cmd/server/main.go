package main

import (
	"backend/internal/router"
	"context"
	"log"
	"os"

	"github.com/go-redis/redis/v8"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()
	PORT := os.Getenv("PORT")
	rdb := redis.NewClient(&redis.Options{
		Addr: "localhost: 6379", //Will put this into env
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
