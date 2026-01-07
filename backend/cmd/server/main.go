package main

import (
	"backend/internal/router"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/websocket"
	"github.com/joho/godotenv"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// func handleWebSocket(w http.ResponseWriter, r *http.Request) {
// 	fmt.Println("WS HANDLER HIT")

// 	conn, err := upgrader.Upgrade(w, r, nil)
// 	if err != nil {
// 		fmt.Println("Upgrade failed:", err)
// 		return
// 	}
// 	defer conn.Close()

// 	fmt.Println("WS CONNECTED")

// 	for {
// 		_, msg, err := conn.ReadMessage()
// 		if err != nil {
// 			fmt.Println("Read error:", err)
// 			return
// 		}

// 		fmt.Println("BACKEND RECEIVED:", string(msg))
// 	}
// }

func main() {
	_ = godotenv.Load()

	PORT := os.Getenv("PORT")
	r := router.Setup()

	// r.GET("/ws", func(c *gin.Context) {
	// 	handleWebSocket(c.Writer, c.Request)
	// })

	if err := r.Run(PORT); err != nil {
		log.Fatalf("Not running")
	}

	// http.HandleFunc("/ws", handleWebSocket)

	log.Println("Server running on ", PORT)
}
