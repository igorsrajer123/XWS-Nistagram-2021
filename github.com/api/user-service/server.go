package main

import (
	"bytes"
	"fmt"
	"image"
	"image/jpeg"
	"io"
	"mime"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/api/user-service/dto"
	"github.com/api/user-service/model"
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

func (userServer *UserServer) SaveCoverPhoto(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	userId, ok := vars["currentId"]
	if !ok {
		fmt.Println("Id is missing!")
	}

	req.ParseMultipartForm(32 << 20)
	file, handle, err := req.FormFile("file")

	if err != nil {
		fmt.Println(err)
		fmt.Fprintf(w, "%v", err)
		return
	}

	defer file.Close()
	absPath, _ := os.Getwd()

	path := filepath.Join(absPath, "files", handle.Filename)

	f, err := os.OpenFile(path, os.O_WRONLY|os.O_CREATE, 0666)

	if err != nil {
		http.Error(w, "Expected file", http.StatusBadRequest)
		return
	}

	_, err = io.Copy(f, file)
	if err != nil {
		fmt.Println(err)
	}

	var savingFile model.UserFile
	savingFile.Path = path
	savingFile.Type = "IMAGE"

	err = userServer.userRepo.CreateCoverPhoto(&savingFile, userId)

	if err != nil {
		w.WriteHeader(http.StatusExpectationFailed)
		return
	}

	fileId := userServer.userRepo.FindIdByPath(path)
	fmt.Println(fileId)

	w.WriteHeader(http.StatusCreated)
}

func (userServer *UserServer) SaveProfilePhoto(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	userId, ok := vars["currentId"]
	if !ok {
		fmt.Println("Id is missing!")
	}

	req.ParseMultipartForm(32 << 20)
	file, handle, err := req.FormFile("file")

	if err != nil {
		fmt.Println(err)
		fmt.Fprintf(w, "%v", err)
		return
	}

	defer file.Close()
	absPath, _ := os.Getwd()

	path := filepath.Join(absPath, "files", handle.Filename)

	f, err := os.OpenFile(path, os.O_WRONLY|os.O_CREATE, 0666)

	if err != nil {
		http.Error(w, "Expected file", http.StatusBadRequest)
		return
	}

	_, err = io.Copy(f, file)
	if err != nil {
		fmt.Println(err)
	}

	var savingFile model.UserFile
	savingFile.Path = path
	savingFile.Type = "IMAGE"

	err = userServer.userRepo.CreateProfilePhoto(&savingFile, userId)

	if err != nil {
		w.WriteHeader(http.StatusExpectationFailed)
		return
	}

	fileId := userServer.userRepo.FindIdByPath(path)
	fmt.Println(fileId)

	w.WriteHeader(http.StatusCreated)
}

func (userServer *UserServer) GetAllUserPhotos(w http.ResponseWriter, req *http.Request) {
	allPhotos := userServer.userRepo.GetAllUserPhotos()

	RenderJSON(w, allPhotos)
}

func (userServer *UserServer) GetCoverImageById(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	imageID := vars["imageID"]
	u64, err := strconv.ParseUint(imageID, 10, 32)
	if err != nil {
		fmt.Println(err)
	}

	image_ID := uint(u64)
	imagePath := userServer.userRepo.FindFilePathById(image_ID)

	f, err := os.Open(imagePath)
	if err != nil {
		fmt.Println(err)
		fmt.Println("	***************************")
	}
	defer f.Close()

	image, _, err := image.Decode(f)
	if err != nil {
		fmt.Println(err)
		fmt.Println("	***************************")
	}

	buffer := new(bytes.Buffer)

	if err := jpeg.Encode(buffer, image, nil); err != nil {
		fmt.Println("Unable to encode image.")
		fmt.Println("	***************************")
	}

	mediaForFrontend := buffer.Bytes()

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(mediaForFrontend)
}

func (userServer *UserServer) AddToCloseFriendsHandler(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	userId, ok := vars["userId"]
	if !ok {
		fmt.Println("Id is missing!")
	}

	vars2 := mux.Vars(req)
	currentUserId, ok := vars2["currentUserId"]
	if !ok {
		fmt.Println("Id is missing!")
	}

	userServer.userRepo.AddToCloseFriends(userId, currentUserId)
	RenderJSON(w, userId)
}

func (userServer *UserServer) RemoveFromCloseFriendsHandler(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	userId, ok := vars["userId"]
	if !ok {
		fmt.Println("Id is missing!")
	}

	vars2 := mux.Vars(req)
	currentUserId, ok := vars2["currentUserId"]
	if !ok {
		fmt.Println("Id is missing!")
	}

	userServer.userRepo.RemoveFromCloseFriends(userId, currentUserId)
	RenderJSON(w, userId)
}

func (userServer *UserServer) GetUserCloseFriendsHandler(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	userId, ok := vars["userId"]
	if !ok {
		fmt.Println("Id is missing!")
	}

	closeFriends := userServer.userRepo.GetUserCloseFriends(userId)
	RenderJSON(w, closeFriends)
}

func (userServer *UserServer) IsInCloseFriendsHandler(w http.ResponseWriter, req *http.Request) {
	vars2 := mux.Vars(req)
	currentUserId, ok := vars2["currentId"]
	if !ok {
		fmt.Println("Id is missing!")
	}

	fmt.Println(currentUserId)

	vars := mux.Vars(req)
	userId, ok := vars["userId"]
	if !ok {
		fmt.Println("Id is missing!")
	}

	fmt.Println(userId)

	isInCloseFriends := userServer.userRepo.IsInCloseFriends(currentUserId, userId)
	RenderJSON(w, isInCloseFriends)
}

func (userServer *UserServer) GetAllValidationRequestsHandler(w http.ResponseWriter, req *http.Request) {
	allRequests := userServer.userRepo.GetAllValidationRequests()

	RenderJSON(w, allRequests)
}

func (userServer *UserServer) CreateValidationRequestHandler(w http.ResponseWriter, req *http.Request) {
	req.ParseMultipartForm(32 << 20)
	file, handle, err := req.FormFile("file")

	defer file.Close()
	absPath, _ := os.Getwd()

	path := filepath.Join(absPath, "files", handle.Filename)
	f, err := os.OpenFile(path, os.O_WRONLY|os.O_CREATE, 0666)
	if err != nil {
		http.Error(w, "Expected file", http.StatusBadRequest)
		return
	}

	_, err = io.Copy(f, file)
	if err != nil {
		fmt.Println(err)
	}

	var savingFile model.UserFile
	savingFile.Path = path
	savingFile.Type = "IMAGE"

	var request model.AccountValidationRequest
	request.Category = req.PostFormValue("category")
	request.FirstName = req.PostFormValue("firstName")
	request.LastName = req.PostFormValue("lastName")
	userId := req.PostFormValue("user")
	request.UserId, _ = strconv.Atoi(userId)

	requestId := userServer.userRepo.CreateValidationRequest(request.FirstName, request.LastName, request.UserId, request.Category)

	err = userServer.userRepo.CreateDocumentPhoto(&savingFile, requestId)

	if err != nil {
		w.WriteHeader(http.StatusExpectationFailed)
		return
	}

	w.WriteHeader(http.StatusCreated)
}
