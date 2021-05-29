package dto

type UserDto struct {
	ID          int    `json:"id" gorm:"primaryKey"`
	Email       string `json:"email" gorm:"unique;not null"`
	FirstName   string `json:"firstName"`
	LastName    string `json:"lastName"`
	Age         int    `json:"age"`
	PhoneNumber string `json:"phoneNumber"`
}

type ResponseId struct {
	Id int `json:"id"`
}
