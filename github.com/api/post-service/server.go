package main

import (
	"bytes"
	"fmt"
	"image"
	"image/jpeg"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/api/post-service/model"
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
	req.ParseMultipartForm(32 << 20)
	file, handle, err := req.FormFile("file")

	if err != nil {
		var post model.Post
		post.Description = req.PostFormValue("description")
		post.Location = req.PostFormValue("location")
		userId := req.PostFormValue("user")
		post.UserRefer, _ = strconv.Atoi(userId)
		stringTags := req.PostFormValue("tags")
		post.Tags = strings.Split(stringTags, " ")

		postId := postServer.postRepo.CreateStatusPost(post.Description, post.Tags, post.Location, post.UserRefer)
		fmt.Println(postId)

	} else {
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

		var savingFile model.File
		savingFile.Path = path
		savingFile.Type = "IMAGE"

		var post model.Post
		post.Description = req.PostFormValue("description")
		post.Location = req.PostFormValue("location")
		userId := req.PostFormValue("user")
		post.UserRefer, _ = strconv.Atoi(userId)
		stringTags := req.PostFormValue("tags")
		post.Tags = strings.Split(stringTags, " ")

		postId := postServer.postRepo.CreateStatusPost(post.Description, post.Tags, post.Location, post.UserRefer)

		err = postServer.postRepo.CreateStatusPostPhoto(&savingFile, postId)
		if err != nil {
			w.WriteHeader(http.StatusExpectationFailed)
			return
		}
	}

	w.WriteHeader(http.StatusCreated)
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

func (postServer *PostServer) GetAllPostPhotosHandler(w http.ResponseWriter, req *http.Request) {
	allPhotos := postServer.postRepo.GetAllPostPhotos()

	RenderJSON(w, allPhotos)
}

func (postServer *PostServer) GetPostPictureHandler(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	imageID := vars["imageID"]
	u64, err := strconv.ParseUint(imageID, 10, 32)
	if err != nil {
		fmt.Println(err)
	}

	image_ID := uint(u64)
	imagePath := postServer.postRepo.FindFilePathById(image_ID)

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
