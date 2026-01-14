package dataaccess

import (
	"backend/internal/database"
	"backend/internal/models"
	utils "backend/internal/utils"
	"context"
	"database/sql"
	"fmt"
)

func CheckTopicExisting(title string) (bool, error) {
	db := database.Connect()
	defer database.Close(db)

	var exists bool
	query := `
		SELECT EXISTS(
			SELECT 1
			FROM topics
			WHERE title = $1
		)
	`

	err := db.QueryRow(query, title).Scan(&exists)
	return exists, err
}

func CreateTopic(title, description, username string) (int, error) {
	db := database.Connect()
	defer database.Close(db)

	ctx := context.Background()

	exists, err := CheckTopicExisting(title)
	if exists {
		fmt.Print("existing")
		return -1, err
	}

	userID, err := utils.GetUserID(ctx, db, username)
	if err != nil {
		return -1, err
	}

	const query = `
		INSERT INTO topics (title, description, created_by)
		VALUES ($1, $2, $3)
		RETURNING id;
	`

	var id int
	err = db.QueryRowContext(ctx, query, title, description, userID).Scan(&id)
	return id, err
}

func FetchTopic(username string) ([]models.TopicReturn, error) {
	db := database.Connect()
	defer database.Close(db)

	ctx := context.Background()

	const query = `
		SELECT
			t.id,
			t.title,
			t.description,
			(tp.topic_id IS NOT NULL) AS pinned,
			(t.created_by = u.id) AS created
		FROM topics t
		JOIN users u ON u.username = $1
		LEFT JOIN topic_pins tp
			ON tp.topic_id = t.id
			AND tp.user_id = u.id;
	`

	rows, err := db.QueryContext(ctx, query, username)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var topics []models.TopicReturn

	for rows.Next() {
		var topic models.TopicReturn
		if err := rows.Scan(
			&topic.ID,
			&topic.Title,
			&topic.Description,
			&topic.Pinned,
			&topic.Created,
		); err != nil {
			return nil, err
		}

		topics = append(topics, topic)
	}

	return topics, nil
}

func PinToggleTopic(title, username string) error {
	db := database.Connect()
	defer database.Close(db)

	ctx := context.Background()

	userID, err := utils.GetUserID(ctx, db, username)
	if err != nil {
		return err
	}

	topicID, err := utils.GetTopicID(ctx, db, title)
	if err != nil {
		return err
	}

	queryPin := `INSERT INTO topic_pins (user_id, topic_id) VALUES ($1, $2); `
	queryUnPin := `DELETE FROM topic_pins WHERE user_id = $1 AND topic_id = $2;`
	queryCheckExist := `
		SELECT 1
		FROM topic_pins
		WHERE user_id = $1 AND topic_id = $2
		LIMIT 1;
	`

	var exists int
	err = db.QueryRowContext(ctx, queryCheckExist, userID, topicID).Scan(&exists)

	if err == sql.ErrNoRows {
		_, err = db.ExecContext(ctx, queryPin, userID, topicID)
		return err
	} else if err != nil {
		return err
	}
	_, err = db.ExecContext(ctx, queryUnPin, userID, topicID)
	return err
}

func UpdateTopic(id int, title string, description string) error {
	db := database.Connect()
	defer database.Close(db)

	ctx := context.Background()

	query := `
		UPDATE topics
		SET title = $1, description = $2
		WHERE id = $3
	`

	_, err := db.ExecContext(ctx, query, title, description, id)
	return err
}

func DeleteTopic(id int) error {
	db := database.Connect()
	defer database.Close(db)

	ctx := context.Background()

	query := `
		DELETE FROM topics WHERE id = $1;
	`
	_, err := db.ExecContext(ctx, query, id)
	return err
}
