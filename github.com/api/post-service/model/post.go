package model

import "time"

type Post struct {
	ID          int       `json:"id"`
	Description string    `json:"description"`
	Published   time.Time `json:"published"`
	Expires     time.Time `json:"expires"`
}
