package dto

import "time"

type PostDto struct {
	Description string    `json:"description"`
	Published   time.Time `json:"published"`
	Expires     time.Time `json:"expires"`
}

type ResponseId struct {
	Id int `json:"id"`
}
