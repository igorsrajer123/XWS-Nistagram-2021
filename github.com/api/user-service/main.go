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
	server, err := NewUserServer()
	if err != nil {
		log.Fatal(err.Error())
	}

	defer server.CloseDB()

	router.HandleFunc("/getAllUsers", server.GetAllUsersHandler).Methods("GET")
	router.HandleFunc("/createUser", server.CreateUserHandler).Methods("POST")
	router.HandleFunc("/checkUserExists/{email}", server.checkUserExists).Methods("GET")
	router.HandleFunc("/getById/{id}", server.GetUserByIdHandler).Methods("GET")
	router.HandleFunc("/getUserByEmail/{email}", server.GetUserByEmailHandler).Methods("GET")
	router.HandleFunc("/editUserInfo", server.EditUserHandler).Methods("PUT")
	router.HandleFunc("/changePassword", server.ChangeUserPasswordHandler).Methods("PUT")
	router.HandleFunc("/toggleProfilePrivacy/{id}", server.ToggleProfilePrivacyHandler).Methods("PUT")
	router.HandleFunc("/searchPublicProfiles/{searchParams}", server.SearchPublicProfilesHandler).Methods("GET")
	router.HandleFunc("/searchAllProfiles/{searchParams}", server.SearchAllProfilesHandler).Methods("GET")

	srv := &http.Server{Addr: "0.0.0.0:8000", Handler: router}
	go func() {
		log.Println("User server starting...")
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
