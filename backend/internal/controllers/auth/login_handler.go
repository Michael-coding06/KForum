package auth

import (
	dataAuth "backend/internal/dataaccess"
	models "backend/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (c *Controller) LogIn(ctx *gin.Context) {
	var req models.AuthRequest

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	err := dataAuth.VerifyUser(req.Username, req.Password)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	issuedJWT, _ := models.CreateJWT(req.Username)
	ctx.SetCookie(
		"auth_token",
		issuedJWT,
		10*24*60*60, //10 days
		"/",
		"3.27.131.69",
		false,
		true, //HttpOnly
	)
	ctx.JSON(http.StatusOK, gin.H{"message": "Logged in successfully"})
}
