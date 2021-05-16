package repository

import (
	"fmt"
	"os"

	"github.com/api/post-service/model"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type PostRepository struct {
	db *gorm.DB
}

func New() (*PostRepository, error) {
	postRepo := &PostRepository{}

	host := os.Getenv("DBHOST")
	user := os.Getenv("USER")
	password := os.Getenv("PASSWORD")
	dbname := os.Getenv("DBNAME")
	dbport := os.Getenv("DBPORT")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Shanghai", host, user, password, dbname, dbport)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}
	postRepo.db = db
	postRepo.db.AutoMigrate(&model.Post{})

	return postRepo, nil
}

func (userRepo *PostRepository) Close() error {
	db, err := userRepo.db.DB()
	if err != nil {
		return err
	}

	db.Close()
	return nil
}
