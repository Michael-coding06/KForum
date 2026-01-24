package models

import "time"

type CreateRequest struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description" binding:"required"`
}

type PinRequest struct {
	Title string `json:"title" binding:"required"`
}

type Topic struct {
	ID          int
	Title       string
	Description string
	CreatedBy   string
	CreatedAt   time.Time
}

type TopicReturn struct {
	ID          int
	Title       string
	Description string
	Pinned      bool
	Created     bool
}
