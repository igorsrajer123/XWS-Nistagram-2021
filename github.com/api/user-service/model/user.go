package model

type User struct {
	ID             int     `json:"id" gorm:"primaryKey"`
	Email          string  `json:"email" gorm:"unique;not null"`
	Password       string  `json:"password" gorm:"not null"`
	FirstName      string  `json:"firstName"`
	LastName       string  `json:"lastName"`
	Age            int     `json:"age"`
	PhoneNumber    string  `json:"phoneNumber"`
	Gender         string  `json:"gender"`
	Location       string  `json:"location"`
	PrivateProfile *bool   `json:"privateProfile" gorm:"default:false"`
	Description    string  `json:"description"`
	Website        string  `json:"website"`
	Followings     []*User `gorm:"foreignkey:ID;many2many:followings;" json:"followings"`
	Followers      []*User `gorm:"foreignkey:ID;many2many:followers;" json:"followers"`
}

type FollowRequest struct {
	FollowId int    `json:"id" gorm:"primaryKey"`
	SentById int    `json:"sentById"`
	SentToId int    `json:"sentToId"`
	Status   string `json:"status"`
}
