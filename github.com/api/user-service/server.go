package main

import (
	"github.com/api/user-service/repository"
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
