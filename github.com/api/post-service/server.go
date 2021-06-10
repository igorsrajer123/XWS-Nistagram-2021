package main

import (
	"fmt"
	"mime"
	"net/http"
	"strconv"

	"github.com/api/post-service/repository"
	"github.com/gorilla/mux"
)

type PostServer struct {
	postRepo *repository.PostRepository
}

func NewPostServer() (*PostServer, error) {
	postRepo, err := repository.New()
	if err != nil {
		return nil, err
	}

	return &PostServer{
		postRepo: postRepo,
	}, nil
}

func (server *PostServer) CloseDB() error {
	return server.postRepo.Close()
}

func (postServer *PostServer) GetAllPostsHandler(w http.ResponseWriter, req *http.Request) {
	allPosts := postServer.postRepo.GetAllPosts()
	RenderJSON(w, allPosts)
}

func (postServer *PostServer) CreateStatusPostHandler(w http.ResponseWriter, req *http.Request) {
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

	post, err := DecodeBody(req.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	id := postServer.postRepo.CreateStatusPost(post.Description, post.Tags, post.Location, post.UserRefer)
	RenderJSON(w, id)
}

func (postServer *PostServer) GetUserStatusPostsHandler(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	id, ok := vars["userId"]
	if !ok {
		fmt.Println("Id is missing!")
	}

	stringId, _ := strconv.Atoi(id)
	userPosts := postServer.postRepo.GetUserStatusPosts(stringId)
	if userPosts != nil {
		RenderJSON(w, userPosts)
	} else {
		w.WriteHeader(http.StatusNotFound)
	}
}

func (postServer *PostServer) LikePostHandler(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	id, ok := vars["postId"]
	if !ok {
		fmt.Println("Id is missing!")
	}

	stringId, _ := strconv.Atoi(id)
	postServer.postRepo.LikePost(stringId)
}

func (postServer *PostServer) DislikePostHandler(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	id, ok := vars["postId"]
	if !ok {
		fmt.Println("Id is missing!")
	}

	stringId, _ := strconv.Atoi(id)
	postServer.postRepo.DislikePost(stringId)
}

func (postServer *PostServer) SearchPublicPostsHandler(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	searchParam, ok := vars["searchParam"]
	if !ok {
		fmt.Println("Search parameter is missing!")
	}

	searchResult := postServer.postRepo.SearchPublicPosts(searchParam)

	if len(searchResult) > 0 {
		RenderJSON(w, searchResult)
	} else {
		w.WriteHeader(http.StatusNotFound)
		return
	}
}
