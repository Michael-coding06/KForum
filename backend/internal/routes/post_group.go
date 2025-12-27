package routes

import (
	PostCtrl "backend/backend/internal/controllers/post"
	"backend/backend/internal/middleware"

	"github.com/gin-gonic/gin"
)

func postGroup(r *gin.RouterGroup) {
	ctrl := PostCtrl.NewController()
	r.POST("/create", middleware.AuthMiddleWare(), ctrl.Create)
	r.GET("/fetch/:topicTitle", middleware.AuthMiddleWare(), ctrl.Fetch)
	r.GET("/fetch1/:postTitle", middleware.AuthMiddleWare(), ctrl.Fetch1)
	r.POST("/like", middleware.AuthMiddleWare(), ctrl.Like)
	r.PUT("/update/:id", middleware.AuthMiddleWare(), ctrl.Update)
	r.DELETE("/delete/:id", middleware.AuthMiddleWare(), ctrl.Delete)
}
