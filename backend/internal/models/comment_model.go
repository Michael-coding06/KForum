package models

import (
	"time"
)

type CommentCreate struct {
	Comment string `json:"comment" binding:"required"`
	PostID  int    `json:"postID" binding:"required"`
}

type CommentReturn struct {
	ID      int    `json:"ID"`
	Comment string `json:"Comment"`
	// NoLikes   int        `json:"NoLikes"`
	// Liked     bool       `json:"Liked"`
	Edited    bool       `json:"Edited"`
	EditedAt  *time.Time `json:"EditedAt"`
	CreatedBy string     `json:"CreatedBy"`
}
