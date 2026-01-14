package middleware

import (
	"backend/internal/dataaccess"
	"backend/internal/utils"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func EditMiddleWare(table string) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		userID, ok := utils.GetUserID2(ctx)

		if !ok {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "User identity not found"})
			return
		}

		id, ok := utils.GetIDParam(ctx)

		if !ok {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid resource ID"})
			return
		}

		can, err := dataaccess.HaveAccess(table, userID, id)

		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
			return
		}

		if !can {
			ctx.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "You do not have access to modify this resource"})
			return
		}

		fmt.Printf("YOU HAVE ACCESS, CAN UPDATE")
		ctx.Next()
	}
}
