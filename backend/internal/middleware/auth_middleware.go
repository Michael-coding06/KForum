package middleware

import (
	"backend/internal/config"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	UserID   int    `json:"sub"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

func AuthMiddleWare() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		fmt.Printf("at auth middleware right now. Is authorizing...\n")
		cookie, err := ctx.Request.Cookie("auth_token")
		fmt.Printf("this is the cookie received from auth_token: ", cookie)
		if err != nil {
			ctx.AbortWithStatus(http.StatusUnauthorized)
			return
		}
		claims := &Claims{}
		token, err := jwt.ParseWithClaims(cookie.Value, claims, func(t *jwt.Token) (interface{}, error) {
			return config.JWTSecret, nil
		})
		fmt.Print("decrypting the token to JWT Secret")

		if err != nil || !token.Valid {
			ctx.AbortWithStatus(http.StatusUnauthorized)
			return
		}
		fmt.Printf(claims.Username)
		ctx.Set("username", claims.Username)
		ctx.Set("userID", claims.UserID)
		ctx.Next()
	}
}
