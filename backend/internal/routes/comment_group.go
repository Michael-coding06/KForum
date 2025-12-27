package routes

import (
	commentControl "backend/backend/internal/controllers/comment"
	"backend/backend/internal/middleware"

	"github.com/gin-gonic/gin"
)

func commentGroup(r *gin.RouterGroup) {
	ctrl := commentControl.NewController()

	r.POST("/create", middleware.AuthMiddleWare(), ctrl.Create)
}
