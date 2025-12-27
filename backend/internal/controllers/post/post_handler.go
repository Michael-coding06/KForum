package post

import (
	dataaccess "backend/backend/internal/dataaccess"
	"backend/backend/internal/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func (c *Controller) Create(ctx *gin.Context) {
	var req models.PostCreate

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

	err := dataaccess.CreatePost(req.Title, req.Details, req.Topic, username)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"post": []string{req.Title, req.Details}})
}

func (c *Controller) Fetch(ctx *gin.Context) {
	usernameIface, _ := ctx.Get("username")

	username, ok := usernameIface.(string)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid username after decoding JWT"})
		return
	}

	topicTitle := ctx.Param("topicTitle")
	posts, err := dataaccess.FetchPost(username, topicTitle)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch posts"})
		return
	}

	ctx.JSON(http.StatusOK, posts)
}

func (c *Controller) Fetch1(ctx *gin.Context) {
	usernameIface, _ := ctx.Get("username")

	username, ok := usernameIface.(string)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid username after decoding JWT"})
		return
	}

	postTitle := ctx.Param("postTitle")
	post, err := dataaccess.Fetch1Post(username, postTitle)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch 1 post"})
		return
	}

	ctx.JSON(http.StatusOK, post)
}

func (c *Controller) Like(ctx *gin.Context) {
	var req models.PostLike

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}
	// fmt.Print("still running")
	// fmt.Print(req.Title)
	usernameIface, _ := ctx.Get("username")

	username, ok := usernameIface.(string)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid username after decoding JWT"})
		return
	}
	number, err := dataaccess.LikePost(req.Title, username)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"NoLikes": []int{number}})
}

func (c *Controller) Update(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}
	var req models.PostUpdate

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid reqeuest"})
		return
	}

	err = dataaccess.UpdatePost(id, req.Title, req.Details)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"updated post": []string{req.Title, req.Details}})
}

func (c *Controller) Delete(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	err = dataaccess.DeletePost(id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
}
