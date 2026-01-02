package middleware

import (
	"backend/internal/config"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	Name string `json:"sub"`
	jwt.RegisteredClaims
}

func AuthMiddleWare() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		fmt.Print("at auth middleware right now. Is authorizing...\n")
		cookie, err := ctx.Request.Cookie("auth_token")
		fmt.Print("this is the cookie received from auth_token")
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
		username := claims.Name
		ctx.Set("username", username)
		ctx.Next()
	}
}
