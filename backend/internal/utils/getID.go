package utils

import (
	"context"
	"database/sql"
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
