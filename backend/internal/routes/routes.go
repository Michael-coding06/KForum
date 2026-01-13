package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
)

func GetRoutes(rdb *redis.Client) func(r *gin.Engine) {
	return func(r *gin.Engine) {
		auth := r.Group("/auth")
		authGroup(auth)

		topic := r.Group("/topic")
		topicGroup(topic)

		post := r.Group("/post")
		postGroup(post)

		comment := r.Group("/comment")
		commentGroup(comment, rdb)

		health := r.Group("/health")
		healthGroup(health)

	}
}
