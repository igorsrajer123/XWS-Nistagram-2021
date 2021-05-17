package main

import (
	"net/http"

	"github.com/api/post-service/repository"
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
