package dataaccess

import (
	"backend/backend/internal/database"
	"backend/backend/internal/models"
	utils "backend/backend/internal/utils"
	"context"
	"fmt"
)

func CreatePost(title string, details string, topic string, username string) error {
	db := database.Connect()
	defer database.Close(db)

	ctx := context.Background()

	userID, err := utils.GetUserID(ctx, db, username)
	if err != nil {
		return err
	}

	const queryFindTopicId = `
		SELECT id FROM topics WHERE title = $1;
	`

	var topic_id int
	err = db.QueryRowContext(
		ctx,
		queryFindTopicId,
		topic,
	).Scan(&topic_id)

	const query = `
		INSERT INTO posts (topic_id, title, details, created_by)
		VALUES ($1, $2, $3, $4);
	`

	_, err = db.ExecContext(ctx, query, topic_id, title, details, userID)
	return err
}

func FetchPost(username string, topicTitle string) ([]models.PostReturn, error) {
	db := database.Connect()
	defer database.Close(db)

	ctx := context.Background()

	topicID, err := utils.GetTopicID(ctx, db, topicTitle)
	if err != nil {
		return nil, err
	}

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
			COUNT(pl.id) AS like_count,
			CASE
				WHEN EXISTS (
					SELECT 1 FROM post_likes pl2
					WHERE pl2.user_id = $1 AND pl2.post_id = p.id
				) THEN TRUE
				ELSE FALSE
			END AS liked

		FROM posts p
		JOIN users u ON p.created_by = u.id
		LEFT JOIN post_likes pl ON p.id = pl.post_id
		WHERE p.topic_id = $2
		GROUP BY p.id, p.title, p.details, u.username, p.edited, p.edited_at;
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
			&post.Liked,
		); err != nil {
			return nil, err
		}

		posts = append(posts, post)
	}

	return posts, nil
}

func Fetch1Post(username string, postTitle string) (models.PostReturn, error) {
	db := database.Connect()
	defer database.Close(db)

	ctx := context.Background()

	postID, err := utils.GetPostID(ctx, db, postTitle)
	if err != nil {
		return models.PostReturn{}, err
	}

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
			COUNT(pl.id) AS like_count,
			CASE
				WHEN EXISTS (
					SELECT 1 
					FROM post_likes pl2 
					WHERE pl2.user_id = $1 AND pl2.post_id = p.id
				) THEN TRUE
				ELSE FALSE
			END AS liked
		FROM posts p
		JOIN users u ON p.created_by = u.id
		LEFT JOIN post_likes pl ON p.id = pl.post_id
		WHERE p.id = $2
		GROUP BY p.id, p.title, p.details, u.username, p.edited, p.edited_at;
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
		&post.Liked,
	)
	if err != nil {
		return models.PostReturn{}, err
	}

	return post, nil
}

func LikePost(postTitle string, username string) (int, error) {
	// fmt.Print(postTitle)
	db := database.Connect()
	defer database.Close(db)

	ctx := context.Background()

	var postID int
	const queryFindPostID = `
		SELECT id FROM posts WHERE title = $1
	`
	// fmt.Printf("THIS IS STILL RUNNING")
	err := db.QueryRowContext(
		ctx,
		queryFindPostID,
		postTitle,
	).Scan(&postID)

	fmt.Print(postTitle)
	if err != nil {
		// fmt.Printf("CAN NOT FIND THE POSTID")
		return -1, err
	}

	userID, err := utils.GetUserID(ctx, db, username)
	if err != nil {
		return -1, err
	}

	var already bool
	const queryCheckAlreadyLiked = `
		SELECT EXISTS (
			SELECT 1 
			FROM post_likes
			WHERE user_id = $1 AND post_id = $2
		);
	`

	err = db.QueryRowContext(ctx, queryCheckAlreadyLiked, userID, postID).Scan(&already)

	const queryUnlike = `
		DELETE FROM post_likes 
		WHERE user_id = $1 AND post_id = $2;
	`

	const queryLike = `
		INSERT INTO post_likes (user_id, post_id)
		VALUES ($1, $2);
	`
	if already {
		_, err = db.ExecContext(ctx, queryUnlike, userID, postID)
	} else {
		_, err = db.ExecContext(ctx, queryLike, userID, postID)
	}

	if err != nil {
		return -1, err
	}

	var noLike int
	const queryNoLike = `
		SELECT COUNT(pl.post_id)
		FROM post_likes pl
		WHERE pl.post_id = $1
	`
	err = db.QueryRowContext(ctx, queryNoLike, postID).Scan(&noLike)
	return noLike, err
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
