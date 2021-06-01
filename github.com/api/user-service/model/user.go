package model

type User struct {
	ID             int    `json:"id" gorm:"primaryKey"`
	Email          string `json:"email" gorm:"unique;not null"`
	Password       string `json:"password" gorm:"not null"`
	FirstName      string `json:"firstName"`
	LastName       string `json:"lastName"`
	Age            int    `json:"age"`
	PhoneNumber    string `json:"phoneNumber"`
	Gender         string `json:"gender"`
	Location       string `json:"location"`
	PrivateProfile bool   `json:"privateProfile"`
	Description    string `json:"description"`
	Website        string `json:"website"`
}
