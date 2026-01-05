package models

import "time"

type PostCreate struct {
	Title   string `json:"title" binding:"required"`
	Details string `json:"details" binding:"required"`
	TopicID int    `json:"topicID" binding:"required"`
	// Username    string `json:"username" binding:"required"`
}

type PostReturn struct {
	ID         int        `json:"ID"`
	Title      string     `json:"Title"`
	Details    string     `json:"Details"`
	NoLikes    int        `json:"NoLikes"`
	NoDislikes int        `json:NoDislikes`
	NoComments int        `json:NoComments`
	Liked      bool       `json:"Liked"`
	Disliked   bool       `json:Disliked`
	Edited     bool       `json:"Edited"`
	EditedAt   *time.Time `json:"EditedAt"`
	CreatedBy  string     `json:"CreatedBy"`
}

type PostReaction struct {
	Reaction int `json:"reaction" binding:"required"`
}

type PostUpdate struct {
	Title   string `json:"Title"`
	Details string `json:"Details"`
}
