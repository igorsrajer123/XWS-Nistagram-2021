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
	router.HandleFunc("/follow/{currentId}/{followingId}", server.FollowHandler).Methods("PUT")
	router.HandleFunc("/unfollow/{currentId}/{followingId}", server.UnfollowHandler).Methods("DELETE")
	router.HandleFunc("/getUserFollowings/{currentId}", server.GetUserFollowingsHandler).Methods("GET")
	router.HandleFunc("/getUserFollowers/{currentId}", server.GetUserFollowersHandler).Methods("GET")
	router.HandleFunc("/getUserFollowRequests/{currentId}", server.GetUserFollowRequestsHandler).Methods("GET")
	router.HandleFunc("/acceptRequest/{currentId}/{senderId}", server.AcceptFollowRequestHandler).Methods("PUT")
	router.HandleFunc("/declineRequest/{currentId}/{senderId}", server.DeclineFollowRequestHandler).Methods("PUT")
	router.HandleFunc("/saveCoverPhoto/{currentId}", server.SaveCoverPhoto).Methods("POST")
	router.HandleFunc("/getUserPhotos", server.GetAllUserPhotos).Methods("GET")
	router.HandleFunc("/getCoverPhoto/{imageID}", server.GetCoverImageById).Methods("GET")
	router.HandleFunc("/saveProfilePhoto/{currentId}", server.SaveProfilePhoto).Methods("POST")
	router.HandleFunc("/getProfilePhoto/{imageID}", server.GetCoverImageById).Methods("GET")

	router.HandleFunc("/addCloseFriend/{userId}/{currentUserId}", server.AddToCloseFriendsHandler).Methods("PUT")
	router.HandleFunc("/removeCloseFriend/{userId}/{currentUserId}", server.RemoveFromCloseFriendsHandler).Methods("PUT")
	router.HandleFunc("/getCloseFriends/{userId}", server.GetUserCloseFriendsHandler).Methods("GET")

	router.HandleFunc("/isInCloseFriends/{currentId}/{userId}", server.IsInCloseFriendsHandler).Methods("GET")

	router.HandleFunc("/getValidationRequests", server.GetAllValidationRequestsHandler).Methods("GET")
	router.HandleFunc("/submitVerificationRequest", server.CreateValidationRequestHandler).Methods("POST")

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
