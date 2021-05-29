package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/api/authentication-service/model"
	"github.com/api/authentication-service/repository"
	"github.com/form3tech-oss/jwt-go"
)

var jwtKey = []byte("my_secret_key")

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

func (server *AuthServer) LoginHandler(w http.ResponseWriter, r *http.Request) {
	var authdetails model.Authentication

	err := json.NewDecoder(r.Body).Decode(&authdetails)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	correctCredentials := server.authRepo.CheckCredentials(authdetails.Email, authdetails.Password)
	if correctCredentials {
		expirationTime := time.Now().Add(5 * time.Minute)

		claims := &model.Claims{
			Email: authdetails.Email,
			StandardClaims: jwt.StandardClaims{
				ExpiresAt: expirationTime.Unix(),
			},
		}

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		tokenString, err := token.SignedString(jwtKey)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		http.SetCookie(w, &http.Cookie{
			Name:    "token",
			Value:   tokenString,
			Expires: expirationTime,
		})

		w.WriteHeader(http.StatusOK)
		w.Write([]byte("200 - OK"))
	} else {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("404 - User Not Found"))
		fmt.Println("Credentials are not correct!")
	}
}

func (server *AuthServer) GetUserHandler(w http.ResponseWriter, r *http.Request) {
	//get token from cookie - cookie is named "token"
	c, err := r.Cookie("token")
	if err != nil {
		if err == http.ErrNoCookie {
			//if there is no cookie - unauthorized
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	//get JWT string from cookie
	tokenString := c.Value
	claims := &model.Claims{}

	//parse JWT string and store it into "claims"
	//this method checks if token is invalid - expired or if signature doesn't match
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})

	//it it's invalid - unauthorized
	if err != nil {
		if err == jwt.ErrSignatureInvalid {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if !token.Valid {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	w.Write([]byte(fmt.Sprintf("Welcome %s!", claims.Email)))
}
