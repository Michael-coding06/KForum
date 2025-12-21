package routes

import (
	"backend/backend/internal/controllers/topic"
	"backend/backend/internal/middleware"

	"github.com/gin-gonic/gin"
)

func topicGroup(r *gin.RouterGroup) {
	ctrl := topic.NewController()

	r.POST("/create", middleware.AuthMiddleWare(), ctrl.Create)
	r.GET("/fetch", middleware.AuthMiddleWare(), ctrl.Fetch)
	r.POST("/pin", middleware.AuthMiddleWare(), ctrl.Pin)
	r.PUT("/update/:id", ctrl.Update)
	r.DELETE("/delete/:id", ctrl.Delete)
}
