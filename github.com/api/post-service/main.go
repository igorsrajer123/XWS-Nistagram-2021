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
