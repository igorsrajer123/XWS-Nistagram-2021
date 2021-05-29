package model

type User struct {
	ID          int    `json:"id" gorm:"primaryKey"`
	Email       string `json:"email" gorm:"unique;not null"`
	Password    string `json:"password" gorm:"not null"`
	FirstName   string `json:"firstName"`
	LastName    string `json:"lastName"`
	Age         int    `json:"age"`
	PhoneNumber string `json:"phoneNumber"`
}
