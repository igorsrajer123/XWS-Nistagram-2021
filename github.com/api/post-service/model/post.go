package model

import (
	"time"

	"github.com/lib/pq"
)

type Post struct {
	ID          int            `json:"id" gorm:"primaryKey"`
	Description string         `json:"description"`
	Tags        pq.StringArray `json:"tags" gorm:"type:text[][]"`
	Published   time.Time      `json:"published"`
	Location    string         `json:"location"`
	UserRefer   int            `json:"userRefer"`
	Type        string         `json:"type"`
	Likes       int            `json:"likes"`
	ImageID     uint           `json:"imageID"`
}

type File struct {
	ID   uint   `json:"id"`
	Path string `json:"path"`
	Type string `json:"type"`
}
