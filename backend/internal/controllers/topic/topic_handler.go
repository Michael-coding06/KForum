package topic

import (
	dataTopic "backend/backend/internal/dataaccess"
	models "backend/backend/internal/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func (c *Controller) Create(ctx *gin.Context) {
	var req models.CreateRequest

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

	err := dataTopic.CreateTopic(req.Title, req.Description, username)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"topic": []string{req.Title, req.Description}})
}

func (c *Controller) Fetch(ctx *gin.Context) {
	usernameIface, _ := ctx.Get("username")
	username, ok := usernameIface.(string)

	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid username after decoding JWT"})
		return
	}

	topics, err := dataTopic.FetchTopic(username)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch topics"})
		return
	}

	ctx.JSON(http.StatusOK, topics)
}

func (c *Controller) Pin(ctx *gin.Context) {
	usernameIface, _ := ctx.Get("username")
	username, ok := usernameIface.(string)

	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid username after decoding JWT"})
		return
	}

	var req models.PinRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	err := dataTopic.PinToggleTopic(req.Title, username)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"topic": []string{req.Title, username}})
}

func (c *Controller) Update(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}
	var req models.CreateRequest

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid reqeuest"})
		return
	}

	err = dataTopic.UpdateTopic(id, req.Title, req.Description)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"updated topic": []string{req.Title, req.Description}})
}

func (c *Controller) Delete(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	err = dataTopic.DeleteTopic(id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
}
