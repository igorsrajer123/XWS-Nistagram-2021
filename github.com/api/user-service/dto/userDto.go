package dto

type UserDto struct {
	Email     string `json:"email" gorm:"unique;not null"`
	Password  string `json:"password" gorm:"not null"`
	FirstName string `json:"firstName" gorm:"not null"`
	LastName  string `json:"lastName" gorm:"not null"`
}

type ResponseId struct {
	Id int `json:"id"`
}
