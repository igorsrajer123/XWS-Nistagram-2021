package repository

import (
	"fmt"
	"os"
	"time"

	"github.com/api/post-service/model"
	"github.com/lib/pq"
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

func (postRepo *PostRepository) GetAllPosts() []model.Post {
	var posts []model.Post
	postRepo.db.Find(&posts)

	return posts
}

func (postRepo *PostRepository) CreateStatusPost(description string, tags pq.StringArray, location string,
	userRefer int) int {

	post := model.Post{
		Description: description,
		Location:    location,
		UserRefer:   userRefer,
		Published:   time.Now(),
		Type:        "STATUS",
		Tags:        tags}

	postRepo.db.Create(&post)
	return post.ID
}

func (postRepo *PostRepository) GetUserStatusPosts(userId int) []model.Post {
	var statusPosts []model.Post
	postRepo.db.Where("user_refer = ?", userId).Find(&statusPosts)

	return statusPosts
}
