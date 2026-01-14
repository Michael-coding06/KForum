package topic

import (
	dataTopic "backend/internal/dataaccess"
	models "backend/internal/models"
	"backend/internal/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (c *Controller) Create(ctx *gin.Context) {
	var req models.CreateRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	username, ok := utils.GetUsername(ctx)
	if !ok {
		return
	}

	id, err := dataTopic.CreateTopic(req.Title, req.Description, username)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"id": id})
}

func (c *Controller) Fetch(ctx *gin.Context) {
	username, ok := utils.GetUsername(ctx)
	if !ok {
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
	username, ok := utils.GetUsername(ctx)
	if !ok {
		return
	}

	var req models.PinRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	if err := dataTopic.PinToggleTopic(req.Title, username); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "success", "title": req.Title})
}

func (c *Controller) Update(ctx *gin.Context) {
	id, ok := utils.GetIDParam(ctx)
	if !ok {
		return
	}

	var req models.CreateRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	if err := dataTopic.UpdateTopic(id, req.Title, req.Description); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"updated_topic": req})
}

func (c *Controller) Delete(ctx *gin.Context) {
	id, ok := utils.GetIDParam(ctx)
	if !ok {
		return
	}

	if err := dataTopic.DeleteTopic(id); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.Status(http.StatusNoContent)
}
