package models

import (
	"backend/internal/config"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type AuthRequest struct {
	Username string `json:"name" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type JWTResponse struct {
	JWT string `json:"JWT"`
}

func CreateJWT(userID int, username string) (string, error) {
	claims := jwt.MapClaims{
		"sub":      userID,
		"username": username,
		"iat":      jwt.NewNumericDate(time.Now()),
		"exp":      jwt.NewNumericDate(time.Now().Add(7 * 24 * time.Hour)),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(config.JWTSecret)
}
