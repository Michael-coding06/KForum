package dataaccess

import (
	"backend/backend/internal/database"
	utils "backend/backend/internal/utils"

	"context"
)

func CreateComment(comment string, postID int, username string) error {
	db := database.Connect()
	defer database.Close(db)

	ctx := context.Background()

	userID, err := utils.GetUserID(ctx, db, username)
	if err != nil {
		return err
	}

	const query = `
		INSERT INTO comments (post_id, comment, created_by)
		VALUES ($1, $2, $3);
	`

	_, err = db.ExecContext(ctx, query, postID, comment, userID)
	return err
}
