package dto

import (
	"time"

	"github.com/lib/pq"
)

type PostDto struct {
	ID          int
	Description string
	Tags        pq.StringArray
	Published   time.Time
	Location    string
	UserRefer   int
	Type        string
	Likes       int
}

type ResponseId struct {
	Id int `json:"id"`
}
