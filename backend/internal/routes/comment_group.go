package routes

import (
	commentControl "backend/internal/controllers/comment"
	"backend/internal/middleware"

	"github.com/gin-gonic/gin"
)

func commentGroup(r *gin.RouterGroup) {
	ctrl := commentControl.NewController()

	r.Use(middleware.AuthMiddleWare())
	{
		r.POST("/create", ctrl.Create)
		r.GET("/fetch/:postID", ctrl.Fetch)
		r.PUT("/update/:commentID", ctrl.Update)
		r.DELETE("/delete/:commentID", ctrl.Delete)
		r.POST("/like/:commentID", ctrl.Like)
		r.POST("/reply", ctrl.Reply)
		r.GET("/reply/fetch/:commentID", ctrl.ReplyFetch)
	}
}
