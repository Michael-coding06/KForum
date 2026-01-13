package router

import (
	"backend/internal/routes"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
)

func Setup(rdb *redis.Client) *gin.Engine {
	r := gin.Default()
	setUpRoutes(r, rdb)
	return r
}

func setUpRoutes(r *gin.Engine, rdb *redis.Client) {
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{os.Getenv("FRONTEND_ORIGIN")},
		AllowMethods:     []string{"POST", "GET", "OPTIONS", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		AllowCredentials: true,
	}))

	routes.GetRoutes(rdb)(r)
}
