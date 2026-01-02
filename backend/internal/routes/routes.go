package routes

import "github.com/gin-gonic/gin"

func GetRoutes() func(r *gin.Engine) {
	return func(r *gin.Engine) {
		auth := r.Group("/auth")
		authGroup(auth)

		topic := r.Group("/topic")
		topicGroup(topic)

		post := r.Group("/post")
		postGroup(post)

		comment := r.Group("/comment")
		commentGroup(comment)

		health := r.Group("/health")
		healthGroup(health)

	}
}
