package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gorilla/mux"
)

func main() {
	quit := make(chan os.Signal)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)

	router := mux.NewRouter()
	router.StrictSlash(true)

	server, err := NewPostServer()
	if err != nil {
		log.Fatal(err.Error())
	}

	defer server.CloseDB()

	router.HandleFunc("/getAllPosts", server.GetAllPostsHandler).Methods("GET")
	router.HandleFunc("/createStatusPost", server.CreateStatusPostHandler).Methods("POST")
	router.HandleFunc("/getUserPosts/{userId}", server.GetUserStatusPostsHandler).Methods("GET")
	router.HandleFunc("/likePost/{postId}", server.LikePostHandler).Methods("PUT")
	router.HandleFunc("/dislikePost/{postId}", server.DislikePostHandler).Methods("PUT")
	router.HandleFunc("/searchPublicPosts/{searchParam}", server.SearchPublicPostsHandler).Methods("GET")
	router.HandleFunc("/getAllPostPhotos", server.GetAllPostPhotosHandler).Methods("GET")
	router.HandleFunc("/getPostPhoto/{imageID}", server.GetPostPictureHandler).Methods("GET")

	router.HandleFunc("/addComment", server.CreateNewCommentHandler).Methods("POST")
	router.HandleFunc("/getPostComments/{postId}", server.GetPostCommentsHandler).Methods("GET")
	router.HandleFunc("/removeComment/{commentId}", server.RemoveCommentHandler).Methods("DELETE")

	router.HandleFunc("/addToFavourites/{postId}/{userId}", server.AddToFavouritesHandler).Methods("PUT")
	router.HandleFunc("/removeFromFavourites/{postId}/{userId}", server.RemoveFromFavouritesHandler).Methods("PUT")
	router.HandleFunc("/getUserFavourites/{userId}", server.GetUserFavouritesHandler).Methods("GET")

	router.HandleFunc("/createStory", server.CreateStoryHandler).Methods("POST")
	router.HandleFunc("/getUserStories/{userId}", server.GetUserStoriesHandler).Methods("GET")
	router.HandleFunc("/getStory/{storyId}", server.GetStoryByIdHandler).Methods("GET")

	router.HandleFunc("/getHighlightedStories/{userId}", server.GetUserHighlightedStoriesHandler).Methods("GET")
	router.HandleFunc("/addToHighlighted/{storyId}/{userId}", server.AddToHighlightedHandler).Methods("PUT")
	router.HandleFunc("/removeFromHighlighted/{storyId}/{userId}", server.RemoveFromHighlightedHandler).Methods("PUT")

	srv := &http.Server{Addr: "0.0.0.0:8000", Handler: router}
	go func() {
		log.Println("Post server starting...")
		if err := srv.ListenAndServe(); err != nil {
			if err != http.ErrServerClosed {
				log.Fatal(err)
			}
		}
	}()

	<-quit

	log.Println("Service shutting down...")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal(err)
	}

	log.Println("Server stopped.")
}
