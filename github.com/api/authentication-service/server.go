package main

import (
	"encoding/json"
	"io/ioutil"
	"net/http"

	"github.com/api/authentication-service/repository"
)

type AuthServer struct {
	authRepo *repository.AuthRepository
}

type Login struct {
	Email    string
	Password string
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
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err.Error())
	}

	var formattedBody Login
	err = json.Unmarshal(body, &formattedBody)
	if err != nil {
		panic(err.Error())
	}

	login := repository.Login(formattedBody.Email, formattedBody.Password)
	if login["message"] == "All is fine!" {
		response := login
		json.NewEncoder(w).Encode(response)
	} else {
		response := "Wrong email or password!"
		json.NewEncoder(w).Encode(response)
	}
}
