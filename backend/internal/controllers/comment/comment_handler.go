package comment

import (
	dataComment "backend/backend/internal/dataaccess"
	"backend/backend/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (c *Controller) Create(ctx *gin.Context) {
	var req models.CommentCreate

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	usernameIface, _ := ctx.Get("username")

	username, ok := usernameIface.(string)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid username after decoding JWT"})
		return
	}

	err := dataComment.CreateComment(req.Comment, req.PostID, username)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"comment": []string{req.Comment}})
}
