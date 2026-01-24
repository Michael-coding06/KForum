package dataaccess

import (
	"backend/internal/database"
	utilsAuth "backend/internal/utils/auth"
	"context"
	"errors"
	"fmt"
)

func AddUser(username string, password string) (int, error) {
	db := database.Connect()
	defer database.Close(db)

	ctx := context.Background()

	const query = `
		INSERT INTO users (username, hash_password)
		VALUES ($1, $2)
		RETURNING id;
	`

	var userID int
	err := db.QueryRowContext(ctx, query, username, password).Scan(&userID)
	return userID, err
}

func CheckExisting(username string) (bool, error) {
	db := database.Connect()
	defer database.Close(db)

	query := `
		SELECT EXISTS(SELECT 1 FROM users WHERE username = $1);
	`

	var exists bool
	err := db.QueryRowContext(
		context.Background(),
		query,
		username,
	).Scan(&exists)

	if err != nil {
		return false, err
	}

	return exists, nil
}

func GetUserID(username string) (int, error) {
	db := database.Connect()
	defer database.Close(db)

	ctx := context.Background()

	query := `
		SELECT id FROM users WHERE username = $1;
	`

	var id int
	err := db.QueryRowContext(ctx, query, username).Scan(&id)
	return id, err
}

func VerifyUser(username string, password string) (int, error) {
	db := database.Connect()
	defer database.Close(db)
	ctx := context.Background()

	existing, err := CheckExisting(username)
	if err != nil {
		return -1, err
	}
	if !existing {
		return -1, errors.New("invalid username or password")
	}

	query := `
		SELECT hash_password FROM users WHERE username = $1;
	`
	var storedPassword string
	err = db.QueryRowContext(ctx, query, username).Scan(&storedPassword)

	if err != nil {
		return -1, err
	}

	err = utilsAuth.ComparePassword(storedPassword, password)
	if err != nil {
		return -1, errors.New("Invalid username or password")
	}

	query = `
		SELECT id FROM users WHERE username = $1;
	`
	var id int
	err = db.QueryRowContext(ctx, query, username).Scan(&id)

	return id, nil
}

func HaveAccess(table string, userID int, componentID int) (bool, error) {
	allowedTables := map[string]bool{"posts": true, "comments": true, "topics": true}
	if !allowedTables[table] {
		return false, fmt.Errorf("invalid table name: %s", table)
	}

	db := database.Connect()
	defer database.Close(db)

	ctx := context.Background()

	query := fmt.Sprintf(`
		SELECT EXISTS (
			SELECT 1 FROM %s
			WHERE id = $1 AND created_by = $2
		)
	`, table)

	var exists bool
	err := db.QueryRowContext(ctx, query, componentID, userID).Scan(&exists)

	if err != nil {
		return false, err
	}

	return exists, nil
}
