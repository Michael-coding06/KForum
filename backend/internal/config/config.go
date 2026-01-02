package config

import (
	"os"

	"github.com/joho/godotenv"
)

var (
	JWTSecret        []byte
	CookieDomain     string
	ConnectionString string
)

func init() {
	godotenv.Load()
	JWTSecret = []byte(os.Getenv("JWT_SECRET"))
	CookieDomain = os.Getenv("COOKIE_DOMAIN")
	ConnectionString = os.Getenv("DATABASE_URL")
}
