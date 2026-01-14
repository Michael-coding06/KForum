package routes

import (
	"backend/internal/controllers/topic"
	"backend/internal/middleware"

	"github.com/gin-gonic/gin"
)

func topicGroup(r *gin.RouterGroup) {
	ctrl := topic.NewController()

	r.Use(middleware.AuthMiddleWare())
	{
		r.POST("/create", ctrl.Create)
		r.GET("/fetch", ctrl.Fetch)
		r.PUT("/update/:id", middleware.EditMiddleWare("topics"), ctrl.Update)
		r.DELETE("/delete/:id", middleware.EditMiddleWare("topics"), ctrl.Delete)
	}
	r.POST("/pin", ctrl.Pin)
}
