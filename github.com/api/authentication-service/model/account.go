package model

import "github.com/form3tech-oss/jwt-go"

type Authentication struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type Claims struct {
	Email string `json:"email"`
	jwt.StandardClaims
}
