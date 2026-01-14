package auth

import (
	dataAuth "backend/internal/dataaccess"
	models "backend/internal/models"
	utilsAuth "backend/internal/utils/auth"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (c *Controller) SignUp(ctx *gin.Context) {
	var req models.AuthRequest

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	hashedPassword, err := utilsAuth.HashPassword(req.Password)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	exists, err := dataAuth.CheckExisting(req.Username)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error checking user exists"})
		return
	}
	if exists {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "User already exists"})
		return
	}

	userID, err := dataAuth.AddUser(req.Username, hashedPassword)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error adding user"})
		return
	}

	issuedJWT, _ := models.CreateJWT(userID, req.Username)
	ctx.SetCookie(
		"auth_token",
		issuedJWT,
		10*24*60*60,
		"/",
		"",
		false,
		true,
	)

	ctx.JSON(http.StatusOK, gin.H{"message": "JWT in Cookie successfully"})
}
