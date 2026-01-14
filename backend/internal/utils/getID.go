package utils

import (
	"context"
	"database/sql"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetUserID(ctx context.Context, db *sql.DB, username string) (int, error) {
	const query = `
		SELECT id FROM users WHERE username = $1;
	`

	var id int
	err := db.QueryRowContext(ctx, query, username).Scan(&id)
	return id, err
}

func GetTopicID(ctx context.Context, db *sql.DB, title string) (int, error) {
	const query = `
		SELECT id FROM topics WHERE title = $1;
	`

	var id int
	err := db.QueryRowContext(ctx, query, title).Scan(&id)
	return id, err
}

func GetPostID(ctx context.Context, db *sql.DB, title string) (int, error) {
	const query = `
		SELECT id FROM posts WHERE title = $1;
	`

	var id int
	err := db.QueryRowContext(ctx, query, title).Scan(&id)
	return id, err
}

func GetIDParam(ctx *gin.Context) (int, bool) {
	idStr := ctx.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return 0, false
	}
	return id, true
}

func GetUsername(ctx *gin.Context) (string, bool) {
	usernameIface, _ := ctx.Get("username")
	username, ok := usernameIface.(string)

	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid username after decoding JWT"})
		return "", false
	}

	return username, true
}

func GetUserID2(ctx *gin.Context) (int, bool) {
	userIDIface, _ := ctx.Get("userID")
	userID, ok := userIDIface.(int)

	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid username after decoding JWT"})
		return -1, false
	}

	return userID, true
}
