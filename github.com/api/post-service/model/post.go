package model

import "time"

type Post struct {
	ID          int       `json:"postId"`
	Description string    `json:"description"`
	Tags        []string  `json:"tags"`
	Published   time.Time `json:"published"`
	Location    string    `json:"location"`
	UserRefer   int       `json:"createdBy"`
	Type        string    `json:"type"`
}
