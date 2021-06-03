package main

import (
	"encoding/json"
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
	} else {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
}

func (server *AuthServer) GetUserHandler(w http.ResponseWriter, r *http.Request) {
	c, err := r.Cookie("token")
	if err != nil {
		if err == http.ErrNoCookie {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	tokenString := c.Value
	claims := &model.Claims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})

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

	w.Write([]byte(claims.Email))
}

func (server *AuthServer) LogoutHandler(w http.ResponseWriter, r *http.Request) {
	cookie := &http.Cookie{
		Name:   "token",
		Value:  "",
		MaxAge: -1,
	}

	http.SetCookie(w, cookie)
}
