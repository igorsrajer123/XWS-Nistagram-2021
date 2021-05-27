package main

import (
	"encoding/json"
	"net/http"

	"github.com/api/authentication-service/repository"

	userModel "github.com/api/user-service/model"
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
	user := &userModel.User{}
	err := json.NewDecoder(r.Body).Decode(user)
	if err != nil {
		var resp = map[string]interface{}{"status": false, "message": "Invalid request!"}
		json.NewEncoder(w).Encode(resp)
		return
	}
	resp := server.authRepo.FindOne(user.Email, user.Password)
	json.NewEncoder(w).Encode(resp)
}
