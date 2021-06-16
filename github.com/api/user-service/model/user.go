package model

import "github.com/lib/pq"

type User struct {
	ID             int           `json:"id" gorm:"primaryKey"`
	Email          string        `json:"email" gorm:"unique;not null"`
	Password       string        `json:"password" gorm:"not null"`
	FirstName      string        `json:"firstName"`
	LastName       string        `json:"lastName"`
	Age            int           `json:"age"`
	PhoneNumber    string        `json:"phoneNumber"`
	Gender         string        `json:"gender"`
	Location       string        `json:"location"`
	PrivateProfile *bool         `json:"privateProfile" gorm:"default:false"`
	Description    string        `json:"description"`
	Website        string        `json:"website"`
	Followings     []*User       `gorm:"foreignkey:ID;many2many:followings;" json:"followings"`
	Followers      []*User       `gorm:"foreignkey:ID;many2many:followers;" json:"followers"`
	CoverImageID   uint          `json:"coverImageId"`
	ProfileImageID uint          `json:"profileImageId"`
	FavouritePosts pq.Int64Array `json:"favouritePosts" gorm:"type:integer[]"`
}

type FollowRequest struct {
	FollowId int    `json:"id" gorm:"primaryKey"`
	SentById int    `json:"sentById"`
	SentToId int    `json:"sentToId"`
	Status   string `json:"status"`
}

type UserFile struct {
	ID   uint   `json:"id"`
	Path string `json:"path"`
	Type string `json:"type"`
}
