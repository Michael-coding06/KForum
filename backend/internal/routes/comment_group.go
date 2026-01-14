package routes

import (
	commentControl "backend/internal/controllers/comment"
	"backend/internal/middleware"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
)

func commentGroup(r *gin.RouterGroup, rdb *redis.Client) {
	ctrl := commentControl.NewController(rdb)

	r.Use(middleware.AuthMiddleWare())
	{
		r.POST("/create", ctrl.Create)
		r.GET("/fetch/:postID", ctrl.Fetch)
		r.PUT("/update/:id", middleware.EditMiddleWare("comments"), ctrl.Update)
		r.DELETE("/delete/:id", middleware.EditMiddleWare("comments"), ctrl.Delete)
		r.POST("/react/:commentID", ctrl.React)
		r.POST("/reply", ctrl.Reply)
		r.GET("/reply/fetch/:commentID", ctrl.ReplyFetch)
		r.POST("/pin/:commentID", ctrl.Pin)
	}
}
