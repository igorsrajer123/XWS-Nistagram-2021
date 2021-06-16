package dto

import "github.com/lib/pq"

type UserDto struct {
	ID             int           `json:"id" gorm:"primaryKey"`
	Email          string        `json:"email" gorm:"unique;not null"`
	FirstName      string        `json:"firstName"`
	LastName       string        `json:"lastName"`
	Age            int           `json:"age"`
	PhoneNumber    string        `json:"phoneNumber"`
	Gender         string        `json:"gender"`
	Location       string        `json:"location"`
	PrivateProfile *bool         `json:"privateProfile"`
	Description    string        `json:"description"`
	Website        string        `json:"website"`
	CoverImageID   uint          `json:"coverImageId"`
	ProfileImageID uint          `json:"profileImageId"`
	FavouritePosts pq.Int64Array `json:"favouritePosts" gorm:"type:integer[]"`
	CloseFriends   pq.Int64Array `json:"closeFriends" gorm:"type:integer[]"`
}

type ResponseId struct {
	Id int `json:"id"`
}
