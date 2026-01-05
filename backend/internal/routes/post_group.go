package routes

import (
	PostCtrl "backend/internal/controllers/post"
	"backend/internal/middleware"

	"github.com/gin-gonic/gin"
)

func postGroup(r *gin.RouterGroup) {
	ctrl := PostCtrl.NewController()

	r.Use(middleware.AuthMiddleWare())
	{
		r.POST("/create", ctrl.Create)
		r.GET("/fetch/:topicID", ctrl.Fetch)
		r.GET("/fetch1/:postID", ctrl.Fetch1)
		// r.POST("/like", ctrl.Like)
		r.POST("/react/:postID", ctrl.React)
		r.PUT("/update/:id", ctrl.Update)
		r.DELETE("/delete/:id", ctrl.Delete)
	}
}
