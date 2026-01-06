package dataaccess

import (
	"backend/internal/database"
	"backend/internal/models"
	"backend/internal/utils"
	"database/sql"

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

func FetchComment(username string, postID int) ([]models.CommentReturn, error) {
	db := database.Connect()
	defer database.Close(db)

	ctx := context.Background()

	userID, err := utils.GetUserID(ctx, db, username)
	if err != nil {
		return nil, err
	}

	const query = `
		SELECT 
			c.id,
			c.comment, 
			u.username,
			c.created_at,
			c.edited,
			c.edited_at,

			(
				SELECT COUNT(*)
				FROM comment_reacts cr
				WHERE cr.comment_id = c.id AND cr.reaction = 1
			) AS like_count,
			 
			(
				SELECT COUNT(*)
				FROM comment_reacts cr
				WHERE cr.comment_id = c.id AND cr.reaction = -1
			) AS dislike_count,

			CASE
				WHEN EXISTS (
					SELECT 1
					FROM comment_reacts cr2
					WHERE cr2.user_id = $2
					AND cr2.comment_id = c.id
					AND cr2.reaction = 1
				) THEN TRUE
				ELSE FALSE
			END AS liked,

			CASE
				WHEN EXISTS (
					SELECT 1
					FROM comment_reacts cr2
					WHERE cr2.user_id = $2
					AND cr2.comment_id = c.id
					AND cr2.reaction = -1
				) THEN TRUE
				ELSE FALSE
			END AS disliked,

			(
				SELECT COUNT(*)
				FROM comments c2
				WHERE c2.parent_comment = c.id
			) AS reply_count,

			EXISTS (
				SELECT 1 FROM comment_pins cp
				WHERE cp.comment_id = c.id
			) AS is_pinned,
				
			c.parent_comment
			
		FROM comments c
		JOIN users u ON c.created_by = u.id
		WHERE c.post_id = $1
		ORDER BY 
			is_pinned DESC,
			c.created_at DESC
	`
	rows, err := db.QueryContext(ctx, query, postID, userID)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var comments []models.CommentReturn

	for rows.Next() {
		var comment models.CommentReturn
		if err := rows.Scan(
			&comment.ID,
			&comment.Comment,
			&comment.CreatedBy,
			&comment.CreatedAt,
			&comment.Edited,
			&comment.EditedAt,
			&comment.NoLikes,
			&comment.NoDislikes,
			&comment.Liked,
			&comment.Disliked,
			&comment.NoComments,
			&comment.IsPinned,
			&comment.ParentComment,
		); err != nil {
			return nil, err
		}

		comments = append(comments, comment)
	}

	return comments, nil
}

func UpdateComment(commentID int, newComment string) error {
	db := database.Connect()
	defer database.Close(db)

	ctx := context.Background()

	query := `
		UPDATE comments
		SET comment = $1, edited = TRUE, edited_at = NOW()
		WHERE id = $2
	`
	// queryUpdateNoReplies := `
	// 	WHILE i.parent_comment NOT NULL
	// 		i.no_replies += 1
	// 		i = i.parent_comment
	// 	FROM comments
	// `

	_, err := db.ExecContext(ctx, query, newComment, commentID)
	return err
}

func DeleteComment(commentID int) error {
	db := database.Connect()
	defer database.Close(db)

	ctx := context.Background()

	query := `
		DELETE FROM comments WHERE id = $1;
	`
	_, err := db.ExecContext(ctx, query, commentID)
	return err
}

func PinComment(username string, commentID int) error {
	db := database.Connect()
	defer database.Close(db)

	ctx := context.Background()

	userID, err := utils.GetUserID(ctx, db, username)
	if err != nil {
		return err
	}

	var already bool
	const queryCheckAlreadyPinned = `
		SELECT EXISTS (
			SELECT 1
			FROM comment_pins
			WHERE comment_id = $1
		)
	`
	err = db.QueryRowContext(ctx, queryCheckAlreadyPinned, commentID).Scan(&already)

	queryUnPin := `
		DELETE FROM comment_pins 
		WHERE comment_id = $1;
	`

	queryPin := `
		INSERT INTO comment_pins (comment_id, pinned_by)
		VALUES ($1, $2);
	`
	if already {
		_, err = db.ExecContext(ctx, queryUnPin, commentID)
	} else {
		_, err = db.ExecContext(ctx, queryPin, commentID, userID)
	}
	return err
}

func ReactComment(newReaction int, commentID int, username string) (int, int, error) {
	db := database.Connect()
	defer database.Close(db)

	ctx := context.Background()

	userID, err := utils.GetUserID(ctx, db, username)
	if err != nil {
		return -1, -1, err
	}

	var currentReact int
	const queryCheckCurrentReact = `
		SELECT reaction FROM comment_reacts
		WHERE user_id = $1 AND comment_id = $2;
	`
	err = db.QueryRow(queryCheckCurrentReact, userID, commentID).Scan(&currentReact)

	isInDB := true

	if err != nil {
		if err == sql.ErrNoRows {
			currentReact = 0 //user has not reacted before
			isInDB = false
		} else {
			return -1, -1, err
		}
	}

	var newReact int

	switch {
	case currentReact == 0: // user either has not reacted before or had neutral reaction
		newReact = newReaction
	case currentReact == newReaction: // user undoes their past react
		newReact = 0
	case currentReact != newReaction: // user switches react
		newReact = -currentReact
	}

	const queryInsertReact = `
		INSERT INTO comment_reacts (reaction, user_id, comment_id)
		VALUES ($1, $2, $3);
	`

	const queryUpdateReact = `
		UPDATE comment_reacts
		SET reaction = $1
		WHERE user_id = $2 AND comment_id = $3;
	`

	if isInDB {
		_, err = db.ExecContext(ctx, queryUpdateReact, newReact, userID, commentID)
	} else {
		_, err = db.ExecContext(ctx, queryInsertReact, newReact, userID, commentID)
	}

	var NoDislikes int
	const queryNoDislikes = `
		SELECT COUNT(cr.comment_id)
		FROM comment_reacts cr
		WHERE reaction = -1 AND comment_id = $1;
	`
	err = db.QueryRowContext(ctx, queryNoDislikes, commentID).Scan(&NoDislikes)

	var NoLikes int
	const queryNoLikes = `
		SELECT COUNT(cr.comment_id)
		FROM comment_reacts cr
		WHERE reaction = 1 AND comment_id = $1;
	`
	err = db.QueryRowContext(ctx, queryNoLikes, commentID).Scan(&NoLikes)

	return NoDislikes, NoLikes, err
}

func ReplyComment(username string, commentID int, reply string, postID int) (int, error) {
	db := database.Connect()
	defer database.Close(db)

	ctx := context.Background()

	userID, err := utils.GetUserID(ctx, db, username)
	if err != nil {
		return -1, err
	}

	const query = `
		INSERT INTO comments (post_id, comment, created_by, parent_comment)
		VALUES ($1, $2, $3, $4)
		RETURNING id;
	`

	var newReply int
	err = db.QueryRowContext(ctx, query, postID, reply, userID, commentID).Scan(&newReply)

	if err != nil {
		return -1, err
	}
	return newReply, err
}

func FetchReply(username string, commentID int) ([]models.CommentReturn, error) {
	db := database.Connect()
	defer database.Close(db)

	ctx := context.Background()

	userID, err := utils.GetUserID(ctx, db, username)
	if err != nil {
		return nil, err
	}

	const query = `
		SELECT 
			c.id,
			c.comment, 
			u.username,
			c.created_at,
			c.edited,
			c.edited_at,

			(
				SELECT COUNT(*)
				FROM comment_reacts cr
				WHERE cr.comment_id = c.id AND cr.reaction = 1
			) AS like_count,

			(
				SELECT COUNT(*)
				FROM comment_reacts cr
				WHERE cr.comment_id = c.id AND cr.reaction = -1
			) AS dislike_count,

			CASE
				WHEN EXISTS (
					SELECT 1
					FROM comment_reacts cr2
					WHERE cr2.user_id = $2
					AND cr2.comment_id = c.id
					AND cr2.reaction = 1
				) THEN TRUE
				ELSE FALSE
			END AS liked,

			CASE
				WHEN EXISTS (
					SELECT 1
					FROM comment_reacts cr2
					WHERE cr2.user_id = $2
					AND cr2.comment_id = c.id
					AND cr2.reaction = -1
				) THEN TRUE
				ELSE FALSE
			END AS disliked,

			(
				SELECT COUNT(*)
				FROM comments c2
				WHERE c2.parent_comment = c.id
			) AS reply_count,

			FALSE as is_pinned,

			c.parent_comment

		FROM comments c
		JOIN users u ON c.created_by = u.id
		WHERE c.parent_comment = $1
		ORDER BY c.created_at ASC;
	`

	rows, err := db.QueryContext(ctx, query, commentID, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var replies []models.CommentReturn

	for rows.Next() {
		var reply models.CommentReturn
		if err := rows.Scan(
			&reply.ID,
			&reply.Comment,
			&reply.CreatedBy,
			&reply.CreatedAt,
			&reply.Edited,
			&reply.EditedAt,
			&reply.NoLikes,
			&reply.NoDislikes,
			&reply.Liked,
			&reply.Disliked,
			&reply.NoComments,
			&reply.IsPinned,
			&reply.ParentComment,
		); err != nil {
			return nil, err
		}

		replies = append(replies, reply)
	}

	return replies, nil
}
