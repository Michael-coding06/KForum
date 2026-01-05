package dataaccess

import (
	"backend/internal/database"
	"backend/internal/models"
	utils "backend/internal/utils"
	"context"
	"database/sql"
	"fmt"
)

func CreatePost(title string, details string, topicID int, username string) error {
	db := database.Connect()
	defer database.Close(db)

	ctx := context.Background()

	userID, err := utils.GetUserID(ctx, db, username)
	if err != nil {
		return err
	}

	const query = `
		INSERT INTO posts (topic_id, title, details, created_by)
		VALUES ($1, $2, $3, $4);
	`

	_, err = db.ExecContext(ctx, query, topicID, title, details, userID)
	return err
}

func FetchPost(username string, topicID int) ([]models.PostReturn, error) {
	db := database.Connect()
	defer database.Close(db)

	ctx := context.Background()

	userID, err := utils.GetUserID(ctx, db, username)
	if err != nil {
		return nil, err
	}

	const query = `
		SELECT 
			p.id, 
			p.title, 
			p.details,
			u.username,
			p.edited,
			p.edited_at,

			(
				SELECT COUNT(*)
				FROM post_reacts pr
				WHERE pr.post_id = p.id AND pr.reaction = 1
			) AS like_count,

			(
				SELECT COUNT(*)
				FROM post_reacts pl
				WHERE pl.post_id = p.id AND pl.reaction = -1
			) AS dislike_count,

			(
				SELECT COUNT(*)
				FROM comments c
				WHERE c.post_id = p.id
			) AS comment_count,

			CASE 
				WHEN EXISTS (
					SELECT 1
					FROM post_reacts pr2
					WHERE pr2.user_id = $1
					AND pr2.post_id = p.id
					AND pr2.reaction = 1
				) THEN TRUE
				ELSE FALSE
			END AS liked,

			CASE 
				WHEN EXISTS (
					SELECT 1
					FROM post_reacts pl2
					WHERE pl2.user_id = $1
					AND pl2.post_id = p.id
					AND pl2.reaction = -1
				) THEN TRUE
				ELSE FALSE
			END AS disliked

		FROM posts p
		JOIN users u ON p.created_by = u.id
		WHERE p.topic_id = $2;
	`

	rows, err := db.QueryContext(ctx, query, userID, topicID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []models.PostReturn

	for rows.Next() {
		var post models.PostReturn
		if err := rows.Scan(
			&post.ID,
			&post.Title,
			&post.Details,
			&post.CreatedBy,
			&post.Edited,
			&post.EditedAt,
			&post.NoLikes,
			&post.NoDislikes,
			&post.NoComments,
			&post.Liked,
			&post.Disliked,
		); err != nil {
			return nil, err
		}

		posts = append(posts, post)
	}

	return posts, nil
}

func Fetch1Post(username string, postID int) (models.PostReturn, error) {
	db := database.Connect()
	defer database.Close(db)

	ctx := context.Background()

	userID, err := utils.GetUserID(ctx, db, username)
	if err != nil {
		return models.PostReturn{}, err
	}

	const query = `
		SELECT 
			p.id, 
			p.title, 
			p.details,
			u.username,
			p.edited,
			p.edited_at,

			(
				SELECT COUNT(*)
				FROM post_reacts pl
				WHERE pl.post_id = p.id AND pl.reaction = 1
			) AS like_count,

			(
				SELECT COUNT(*)
				FROM post_reacts pl
				WHERE pl.post_id = p.id AND pl.reaction = -1
			) AS dislike_count,

			(
				SELECT COUNT(*)
				FROM comments c
				WHERE c.post_id = p.id
			) AS comment_count,

			CASE 
				WHEN EXISTS (
					SELECT 1
					FROM post_reacts pl2
					WHERE pl2.user_id = $1
					AND pl2.post_id = p.id
					AND pl2.reaction = 1
				) THEN TRUE
				ELSE FALSE
			END AS liked,

			CASE 
				WHEN EXISTS (
					SELECT 1
					FROM post_reacts pl2
					WHERE pl2.user_id = $1
					AND pl2.post_id = p.id
					AND pl2.reaction = -1
				) THEN TRUE
				ELSE FALSE
			END AS disliked

		FROM posts p
		JOIN users u ON p.created_by = u.id
		WHERE p.id = $2;
	`

	var post models.PostReturn
	err = db.QueryRowContext(ctx, query, userID, postID).Scan(
		&post.ID,
		&post.Title,
		&post.Details,
		&post.CreatedBy,
		&post.Edited,
		&post.EditedAt,
		&post.NoLikes,
		&post.NoDislikes,
		&post.NoComments,
		&post.Liked,
		&post.Disliked,
	)
	if err != nil {
		return models.PostReturn{}, err
	}

	return post, nil
}

func ReactPost(newReaction int, postID int, username string) (int, int, error) {
	db := database.Connect()
	defer database.Close(db)

	ctx := context.Background()

	userID, err := utils.GetUserID(ctx, db, username)
	if err != nil {
		return -1, -1, err
	}

	fmt.Println("This is the userID: ", userID)
	fmt.Println("This is the postID: ", postID)

	var currentReact int
	// -1: disliked, 0: neutral, 1: liked, none: not reacted before
	const queryCheckCurrentReact = `
		SELECT reaction FROM post_reacts
		WHERE user_id = $1 AND post_id = $2;
	`
	err = db.QueryRow(queryCheckCurrentReact, userID, postID).Scan(&currentReact)
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
		INSERT INTO post_reacts (reaction, user_id, post_id)
		VALUES ($1, $2, $3);
	`

	const queryUpdateReact = `
		UPDATE post_reacts
		SET reaction = $1
		WHERE user_id = $2 AND post_id = $3;
	`

	if isInDB {
		_, err = db.ExecContext(ctx, queryUpdateReact, newReact, userID, postID)
	} else {
		_, err = db.ExecContext(ctx, queryInsertReact, newReact, userID, postID)
	}

	var NoDislikes int
	const queryNoDislikes = `
		SELECT COUNT(pl.post_id)
		FROM post_reacts pl
		WHERE reaction = -1 AND post_id = $1;
	`
	err = db.QueryRowContext(ctx, queryNoDislikes, postID).Scan(&NoDislikes)

	var NoLikes int
	const queryNoLikes = `
		SELECT COUNT(pl.post_id)
		FROM post_reacts pl
		WHERE reaction = 1 AND post_id = $1;
	`
	err = db.QueryRowContext(ctx, queryNoLikes, postID).Scan(&NoLikes)

	return NoDislikes, NoLikes, err
}

func UpdatePost(id int, title string, details string) error {
	db := database.Connect()
	defer database.Close(db)

	ctx := context.Background()

	query := `
		UPDATE posts
		SET title = $1, details = $2, edited = TRUE, edited_at = NOW()
		WHERE id = $3
	`

	_, err := db.ExecContext(ctx, query, title, details, id)
	return err
}

func DeletePost(id int) error {
	db := database.Connect()
	defer database.Close(db)

	ctx := context.Background()

	query := `
		DELETE FROM posts WHERE id = $1;
	`
	_, err := db.ExecContext(ctx, query, id)
	return err
}
