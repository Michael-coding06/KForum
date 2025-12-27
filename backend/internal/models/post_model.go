package models

import "time"

type PostCreate struct {
	Title   string `json:"title" binding:"required"`
	Details string `json:"details" binding:"required"`
	Topic   string `json:"topic" binding:"required"`
	// Username    string `json:"username" binding:"required"`
}

type PostReturn struct {
	ID        int        `json:"ID"`
	Title     string     `json:"Title"`
	Details   string     `json:"Details"`
	NoLikes   int        `json:"NoLikes"`
	Liked     bool       `json:"Liked"`
	Edited    bool       `json:"Edited"`
	EditedAt  *time.Time `json:"EditedAt"`
	CreatedBy string     `json:"CreatedBy"`
}

type PostLike struct {
	Title string `json:"postTitle" binding:"required`
}

type PostUpdate struct {
	Title   string `json:"Title"`
	Details string `json:"Details"`
}
