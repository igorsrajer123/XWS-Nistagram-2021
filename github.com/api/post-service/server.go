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
	"strings"

	"github.com/api/post-service/dto"
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

func (postServer *PostServer) CreateStoryHandler(w http.ResponseWriter, req *http.Request) {
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

	var savingFile model.File
	savingFile.Path = path
	savingFile.Type = "IMAGE"

	var story model.Story
	story.Description = req.PostFormValue("description")
	story.Location = req.PostFormValue("location")
	userId := req.PostFormValue("user")
	story.UserRefer, _ = strconv.Atoi(userId)
	stringTags := req.PostFormValue("tags")
	story.Tags = strings.Split(stringTags, " ")
	checkbox := req.PostFormValue("closeFriends")

	if checkbox == "on" {
		story.CloseFriendsOnly = true
	} else {
		story.CloseFriendsOnly = false
	}

	storyId := postServer.postRepo.CreateStory(story.Description, story.Tags, story.Location, story.UserRefer, story.CloseFriendsOnly)

	err = postServer.postRepo.CreateStoryPhoto(&savingFile, storyId)
	if err != nil {
		w.WriteHeader(http.StatusExpectationFailed)
		return
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

func (postServer *PostServer) GetUserStoriesHandler(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	id, ok := vars["userId"]
	if !ok {
		fmt.Println("Id is missing!")
	}

	stringId, _ := strconv.Atoi(id)
	userStories := postServer.postRepo.GetUserStories(stringId)
	if userStories != nil {
		RenderJSON(w, userStories)
	} else {
		w.WriteHeader(http.StatusNotFound)
	}
}

func (postServer *PostServer) GetStoryByIdHandler(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	id, ok := vars["storyId"]
	if !ok {
		fmt.Println("Id is missing!")
	}

	myStory := postServer.postRepo.GetStoryById(id)
	RenderJSON(w, myStory)
}

func (postServer *PostServer) LikePostHandler(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	id, ok := vars["postId"]
	if !ok {
		fmt.Println("Id is missing!")
	}

	vars2 := mux.Vars(req)
	userId, ok := vars2["currentId"]
	if !ok {
		fmt.Println("Id is missing!")
	}

	fmt.Println(id)
	fmt.Println(userId)

	stringId, _ := strconv.Atoi(id)
	userStringId, _ := strconv.Atoi(userId)
	postServer.postRepo.LikePost(stringId, userStringId)
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

func (postServer *PostServer) CreateNewCommentHandler(w http.ResponseWriter, req *http.Request) {
	contentType := req.Header.Get("Content-Type")
	mediatype, _, err := mime.ParseMediaType(contentType)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if mediatype != "application/json" {
		http.Error(w, "expect application/json Content-Type", http.StatusUnsupportedMediaType)
		fmt.Println("AAAAAAAAA")
		return
	}

	comment, err := DecodeComment(req.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	id := postServer.postRepo.CreateNewComment(comment.UserID, comment.PostID, comment.Text)
	RenderJSON(w, dto.ResponseId{Id: id})
}

func (postServer *PostServer) GetPostCommentsHandler(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	id, ok := vars["postId"]
	if !ok {
		fmt.Println("Id is missing!")
	}

	stringId, _ := strconv.Atoi(id)
	postComments := postServer.postRepo.GetPostComments(stringId)
	if postComments != nil {
		RenderJSON(w, postComments)
	} else {
		w.WriteHeader(http.StatusNotFound)
	}
}

func (postServer *PostServer) RemoveCommentHandler(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	id, ok := vars["commentId"]
	if !ok {
		fmt.Println("Id is missing!")
	}

	stringId, _ := strconv.Atoi(id)
	commentId := postServer.postRepo.RemoveComment(stringId)
	RenderJSON(w, commentId)
}

func (postServer *PostServer) AddToFavouritesHandler(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	postId, ok := vars["postId"]
	if !ok {
		fmt.Println("Id is missing!")
	}

	vars2 := mux.Vars(req)
	userId, ok := vars2["userId"]
	if !ok {
		fmt.Println("Id is missing!")
	}

	postServer.postRepo.AddToFavourites(postId, userId)
	RenderJSON(w, postId)
}

func (postServer *PostServer) RemoveFromFavouritesHandler(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	postId, ok := vars["postId"]
	if !ok {
		fmt.Println("Id is missing!")
	}

	vars2 := mux.Vars(req)
	userId, ok := vars2["userId"]
	if !ok {
		fmt.Println("Id is missing!")
	}

	postServer.postRepo.RemoveFromFavourites(postId, userId)
	RenderJSON(w, postId)
}

func (postServer *PostServer) GetUserFavouritesHandler(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	userId, ok := vars["userId"]
	if !ok {
		fmt.Println("Id is missing!")
	}

	posts := postServer.postRepo.GetUserFavourites(userId)
	RenderJSON(w, posts)
}

func (postServer *PostServer) GetUserHighlightedStoriesHandler(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	userId, ok := vars["userId"]
	if !ok {
		fmt.Println("Id is missing!")
	}

	stories := postServer.postRepo.GetUserHighlightedStories(userId)
	RenderJSON(w, stories)
}

func (postServer *PostServer) AddToHighlightedHandler(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	storyId, ok := vars["storyId"]
	if !ok {
		fmt.Println("Id is missing!")
	}

	vars2 := mux.Vars(req)
	userId, ok := vars2["userId"]
	if !ok {
		fmt.Println("Id is missing!")
	}

	postServer.postRepo.AddToHighlighted(storyId, userId)
	RenderJSON(w, storyId)
}

func (postServer *PostServer) RemoveFromHighlightedHandler(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	storyId, ok := vars["storyId"]
	if !ok {
		fmt.Println("Id is missing!")
	}

	vars2 := mux.Vars(req)
	userId, ok := vars2["userId"]
	if !ok {
		fmt.Println("Id is missing!")
	}

	postServer.postRepo.RemoveFromHighlighted(storyId, userId)
	RenderJSON(w, storyId)
}
