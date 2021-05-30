package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

func main() {
	quit := make(chan os.Signal)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)

	router := mux.NewRouter()
	router.StrictSlash(true)
	server, err := NewAuthenticationServer()
	if err != nil {
		log.Fatal(err.Error())
	}

	defer server.CloseDB()

	headers := handlers.AllowedHeaders([]string{"DNT", "Keep-Alive", "User-Agent", "X-Requested-With", "If-Modified-Since", "Cache-Control", "Content-Type", "Origin", "Accept", "Authorization"})
	methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"})
	origins := handlers.AllowedOrigins([]string{"*"})

	router.HandleFunc("/login", server.LoginHandler).Methods("POST")
	router.HandleFunc("/getCurrentUser", server.GetUserHandler).Methods("GET")

	corsHandler := handlers.CORS(headers, methods, origins)

	srv := &http.Server{Addr: "0.0.0.0:8000", Handler: corsHandler(router)}
	go func() {
		log.Println("Authentication server starting...")
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

	log.Println("Authentication server stopped.")
}
