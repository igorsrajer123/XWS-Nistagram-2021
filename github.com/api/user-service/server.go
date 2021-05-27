package main

import (
	"fmt"
	"mime"
	"net/http"

	"github.com/api/user-service/dto"
	"github.com/api/user-service/repository"
	"github.com/gorilla/mux"
)

type UserServer struct {
	userRepo *repository.UserRepository
}

func NewUserServer() (*UserServer, error) {
	userRepo, err := repository.New()
	if err != nil {
		return nil, err
	}

	return &UserServer{
		userRepo: userRepo,
	}, nil
}

func (server *UserServer) CloseDB() error {
	return server.userRepo.Close()
}

func (userServer *UserServer) GetAllUsersHandler(w http.ResponseWriter, req *http.Request) {
	allUsers := userServer.userRepo.GetAllUsers()
	RenderJSON(w, allUsers)
}

func (userServer *UserServer) GetUserByEmailHandler(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	email, ok := vars["email"]
	if !ok {
		fmt.Println("Email is missing!")
	}

	user := userServer.userRepo.GetUserByEmail(email)
	RenderJSON(w, user)
}

func (userServer *UserServer) CreateUserHandler(w http.ResponseWriter, req *http.Request) {
	contentType := req.Header.Get("Content-Type")
	mediatype, _, err := mime.ParseMediaType(contentType)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if mediatype != "application/json" {
		http.Error(w, "expect application/json Content-Type", http.StatusUnsupportedMediaType)
		return
	}

	user, err := DecodeBody(req.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	id := userServer.userRepo.CreateUser(user.Email, user.Password, user.FirstName, user.LastName)
	RenderJSON(w, dto.ResponseId{Id: id})
}
