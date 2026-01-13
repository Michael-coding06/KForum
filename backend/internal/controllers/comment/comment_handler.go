package comment

import (
	dataComment "backend/internal/dataaccess"
	"backend/internal/models"
	"backend/internal/utils"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func (c *Controller) Create(ctx *gin.Context) {
	var req models.CommentCreate

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	username, ok := utils.GetUsername(ctx)
	if !ok {
		return
	}

	err := dataComment.CreateComment(req.Comment, req.PostID, username)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	commentData, _ := json.Marshal(map[string]interface{}{
		"comment":  req.Comment,
		"post_id":  req.PostID,
		"username": username,
	})
	err = c.RedisCLient.Publish(ctx, "comment_channel", commentData).Err()

	if err != nil {
		fmt.Printf("Redis error")
	}

	ctx.JSON(http.StatusOK, gin.H{"comment": []string{req.Comment}})
}

func (c *Controller) Fetch(ctx *gin.Context) {
	username, ok := utils.GetUsername(ctx)
	if !ok {
		return
	}

	postIDString := ctx.Param("postID")
	postID, err := strconv.Atoi(postIDString)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	comments, err := dataComment.FetchComment(username, postID)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch comments"})
		return
	}

	ctx.JSON(http.StatusOK, comments)
}

func (c *Controller) Update(ctx *gin.Context) {

	commentIDString := ctx.Param("commentID")
	commentID, err := strconv.Atoi(commentIDString)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var req models.CommentUpdate

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid reqeuest"})
		return
	}

	err = dataComment.UpdateComment(commentID, req.Comment)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"updated comment": []string{req.Comment}})

}

func (c *Controller) Delete(ctx *gin.Context) {
	commentIDString := ctx.Param("commentID")
	commentID, err := strconv.Atoi(commentIDString)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	err = dataComment.DeleteComment(commentID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
}

func (c *Controller) React(ctx *gin.Context) {
	username, ok := utils.GetUsername(ctx)
	if !ok {
		return
	}

	commentIDString := ctx.Param("commentID")

	commentID, err := strconv.Atoi(commentIDString)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var req models.CommentReaction
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	NoDislikes, NoLikes, err := dataComment.ReactComment(req.Reaction, commentID, username)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"NoReactions": []int{NoDislikes, NoLikes}})
}

func (c *Controller) Reply(ctx *gin.Context) {
	var req models.CommentReply

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	username, ok := utils.GetUsername(ctx)
	if !ok {
		return
	}

	replyID, err := dataComment.ReplyComment(username, req.CommentID, req.Reply, req.PostID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"reply": gin.H{
			"id":         replyID,
			"comment":    req.Reply,
			"created_by": username,
		},
	})

}

func (c *Controller) ReplyFetch(ctx *gin.Context) {
	username, ok := utils.GetUsername(ctx)
	if !ok {
		return
	}

	commentIDString := ctx.Param("commentID")
	commentID, err := strconv.Atoi(commentIDString)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	replies, err := dataComment.FetchReply(username, commentID)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch replies"})
		return
	}

	ctx.JSON(http.StatusOK, replies)
}

func (c *Controller) Pin(ctx *gin.Context) {
	commentIDString := ctx.Param("commentID")
	commentID, err := strconv.Atoi(commentIDString)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	username, ok := utils.GetUsername(ctx)
	if !ok {
		return
	}

	err = dataComment.PinComment(username, commentID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
}
