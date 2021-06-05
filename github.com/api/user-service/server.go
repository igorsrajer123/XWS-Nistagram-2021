package main

import (
	"fmt"
	"mime"
	"net/http"
	"strconv"

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

	var usersDto []dto.UserDto

	for _, oneUser := range allUsers {
		usersDto = append(usersDto, FromUserToUserDto(oneUser))
	}

	RenderJSON(w, usersDto)
}

func (userServer *UserServer) GetUserByIdHandler(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	id, ok := vars["id"]
	if !ok {
		fmt.Println("Id is missing!")
	}

	intId, err := strconv.Atoi(id)
	if err != nil {
		fmt.Println(err.Error())
	}

	user := userServer.userRepo.GetUserById(intId)
	RenderJSON(w, FromUserToUserDto(user))
}

func (userServer *UserServer) GetUserByEmailHandler(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	email, ok := vars["email"]
	if !ok {
		fmt.Println("Email is missing!")
	}

	user := userServer.userRepo.GetUserByEmail(email)
	RenderJSON(w, FromUserToUserDto(user))
}

func (userServer *UserServer) checkUserExists(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	email, ok := vars["email"]
	if !ok {
		fmt.Println("Email is missing!")
	}

	userExists := userServer.userRepo.CheckIfUserExistsByEmail(email)
	w.Write([]byte(strconv.FormatBool(userExists)))
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

	id := userServer.userRepo.CreateUser(user.Email, user.Password, user.FirstName, user.LastName, user.Age, user.PhoneNumber, user.Gender, user.Location, user.Website)
	RenderJSON(w, dto.ResponseId{Id: id})
}

func (userServer *UserServer) EditUserHandler(w http.ResponseWriter, req *http.Request) {
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

	requestUser, err := DecodeBody(req.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	editedUser := userServer.userRepo.EditUser(requestUser.Email, requestUser.FirstName, requestUser.LastName,
		requestUser.Age, requestUser.PhoneNumber, requestUser.Location, requestUser.Website, requestUser.Description)

	RenderJSON(w, FromUserToUserDto(editedUser))
}

func (userServer *UserServer) ChangeUserPasswordHandler(w http.ResponseWriter, req *http.Request) {
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

	id := userServer.userRepo.ChangeUserPassword(user.Email, user.Password)
	RenderJSON(w, dto.ResponseId{Id: id})
}

func (userServer *UserServer) ToggleProfilePrivacyHandler(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	id, ok := vars["id"]
	if !ok {
		fmt.Println("ID is missing!")
	}

	stringId, err := strconv.Atoi(id)
	if err != nil {
		fmt.Println(err)
	}

	userServer.userRepo.ToggleProfilePrivacy(stringId)
}

func (userServer *UserServer) SearchPublicProfilesHandler(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	params, ok := vars["searchParams"]
	if !ok {
		fmt.Println("Search params is missing!")
	}

	searchResult := userServer.userRepo.SearchPublicProfiles(params)

	if len(searchResult) > 0 {
		var usersDto []dto.UserDto
		for _, oneUser := range searchResult {
			usersDto = append(usersDto, FromUserToUserDto(oneUser))
		}

		RenderJSON(w, usersDto)
	} else {
		w.WriteHeader(http.StatusNotFound)
		return
	}
}

func (userServer *UserServer) SearchAllProfilesHandler(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	params, ok := vars["searchParams"]
	if !ok {
		fmt.Println("Search params is missing!")
	}

	searchResult := userServer.userRepo.SearchAllProfiles(params)

	if len(searchResult) > 0 {
		var usersDto []dto.UserDto
		for _, oneUser := range searchResult {
			usersDto = append(usersDto, FromUserToUserDto(oneUser))
		}

		RenderJSON(w, usersDto)
	} else {
		w.WriteHeader(http.StatusNotFound)
		return
	}
}

func (userServer *UserServer) FollowHandler(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	currentUserId := vars["currentId"]
	followUserId := vars["followingId"]

	result := userServer.userRepo.Follow(currentUserId, followUserId)

	if result == 1 {
		w.WriteHeader(http.StatusCreated)
	}

	if result == 2 {
		w.WriteHeader(http.StatusOK)
	}
}

func (userServer *UserServer) UnfollowHandler(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	currentUserId := vars["currentId"]
	followUserId := vars["followingId"]

	userServer.userRepo.Unfollow(currentUserId, followUserId)
}

func (userServer *UserServer) GetUserFollowingsHandler(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	params, ok := vars["currentId"]
	if !ok {
		fmt.Println("Search params are missing!")
	}

	result := userServer.userRepo.GetUserFollowings(params)
	if result != nil {
		var usersDto []dto.UserDto
		for _, oneUser := range result {
			usersDto = append(usersDto, FromUserToUserDto(*oneUser))
		}
		RenderJSON(w, usersDto)
	} else {
		w.WriteHeader(http.StatusNotFound)
		return
	}
}

func (userServer *UserServer) GetUserFollowersHandler(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	params, ok := vars["currentId"]
	if !ok {
		fmt.Println("Search params are missing!")
	}

	result := userServer.userRepo.GetUserFollowers(params)
	if result != nil {
		var usersDto []dto.UserDto
		for _, oneUser := range result {
			usersDto = append(usersDto, FromUserToUserDto(*oneUser))
		}
		RenderJSON(w, usersDto)
	} else {
		w.WriteHeader(http.StatusNotFound)
		return
	}
}

func (userServer *UserServer) GetUserFollowRequestsHandler(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	params, ok := vars["currentId"]
	if !ok {
		fmt.Println("Search params are missing!")
	}

	result := userServer.userRepo.GetUserActiveFollowRequests(params)
	if result != nil {
		RenderJSON(w, result)
	} else {
		w.WriteHeader(http.StatusNotFound)
		return
	}
}

func (userServer *UserServer) AcceptFollowRequestHandler(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	currentUserId := vars["currentId"]
	senderId := vars["senderId"]

	userServer.userRepo.AcceptFollowRequest(currentUserId, senderId)
}

func (userServer *UserServer) DeclineFollowRequestHandler(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	currentUserId := vars["currentId"]
	senderId := vars["senderId"]

	userServer.userRepo.DeclineFollowRequest(currentUserId, senderId)
}

func (userServer *UserServer) GetFeedStatusPostsHandler(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	currentUserId := vars["currentId"]

	posts := userServer.userRepo.GetFeedStatusPosts(currentUserId)
	if posts != nil {
		RenderJSON(w, posts)
	} else {
		w.WriteHeader(http.StatusNotFound)
		return
	}
}
