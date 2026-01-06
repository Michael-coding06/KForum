package models

import (
	"time"
)

type CommentCreate struct {
	Comment string `json:"comment" binding:"required"`
	PostID  int    `json:"postID" binding:"required"`
}

type CommentReply struct {
	Reply     string `json:"reply" binding:"required"`
	CommentID int    `json:"commentID" binding:"required"`
	PostID    int    `json:"postID" binding:"required"`
}

type CommentReturn struct {
	ID            int        `json:"ID"`
	Comment       string     `json:"Comment"`
	NoLikes       int        `json:"NoLikes"`
	NoDislikes    int        `json:"NoDislikes"`
	NoComments    int        `json:NoComments`
	Liked         bool       `json:"Liked"`
	Disliked      bool       `json:"Disliked"`
	CreatedAt     *time.Time `json: CreatedAt`
	Edited        bool       `json:"Edited"`
	EditedAt      *time.Time `json:"EditedAt"`
	CreatedBy     string     `json:"CreatedBy"`
	ParentComment *int       `json:"ParentComment`
	IsPinned      bool       `json:"IsPinned"`
}

type CommentReaction struct {
	Reaction int `json:"reaction" binding:"required"`
}

type ReplyReturn struct {
	ID        int    `json: ID`
	Comment   string `json:Comment`
	CreatedBy string `json:CreatedBy`
}

type CommentUpdate struct {
	Comment string `json:"comment" binding:"required"`
}
