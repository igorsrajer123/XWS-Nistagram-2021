package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/api/authentication-service/model"
	"github.com/api/authentication-service/repository"
	"github.com/form3tech-oss/jwt-go"
)

type AuthServer struct {
	authRepo *repository.AuthRepository
}

func NewAuthenticationServer() (*AuthServer, error) {
	authRepo, err := repository.New()
	if err != nil {
		return nil, err
	}

	return &AuthServer{
		authRepo: authRepo,
	}, nil
}

func (server *AuthServer) CloseDB() error {
	return server.authRepo.Close()
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	authRepo, err := repository.New()
	if err != nil {
		fmt.Println(err.Error())
	}

	var authdetails model.Authentication

	err2 := json.NewDecoder(r.Body).Decode(&authdetails)
	if err2 != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	fmt.Println(authdetails.Email)
	fmt.Println(authdetails.Password)
	correctCredentials := authRepo.CheckCredentials(authdetails.Email, authdetails.Password)

	if correctCredentials {
		fmt.Println("OVO JE: TACNO!")

		expirationTime := time.Now().Add(5 * time.Minute)

		claims := &model.Claims{
			Email: authdetails.Email,
			StandardClaims: jwt.StandardClaims{
				ExpiresAt: expirationTime.Unix(),
			},
		}

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		os.Setenv("SECRET_KEY", "secret")
		tokenString, err := token.SignedString(os.Getenv("SECRET_KEY"))
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		http.SetCookie(w, &http.Cookie{
			Name:    "token",
			Value:   tokenString,
			Expires: expirationTime,
		})
	} else {
		fmt.Println("Credentials are not correct!")
	}
}
