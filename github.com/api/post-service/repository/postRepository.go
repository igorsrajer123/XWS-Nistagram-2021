package repository

import (
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/api/post-service/model"
	"github.com/lib/pq"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	userModel "github.com/api/user-service/model"
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
	postRepo.db.AutoMigrate(&model.File{})
	postRepo.db.AutoMigrate(&model.Comment{})
	postRepo.db.AutoMigrate(&model.Story{})

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
		Tags:        tags,
		Likes:       0,
		ImageID:     0}

	postRepo.db.Create(&post)

	return post.ID
}

func (postRepo *PostRepository) CreateStory(description string, tags pq.StringArray, location string,
	userRefer int, closeFriendsOnly bool) int {

	story := model.Story{
		Description:      description,
		Location:         location,
		UserRefer:        userRefer,
		Published:        time.Now(),
		Tags:             tags,
		CloseFriendsOnly: closeFriendsOnly,
		Visible:          true,
		ImageID:          0}

	postRepo.db.Create(&story)

	return story.ID
}

func (postRepo *PostRepository) GetStoryById(storyId string) model.Story {
	var story model.Story
	postRepo.db.Where("id = ?", storyId).Find(&story)

	return story
}

func (postRepo *PostRepository) GetUserStories(userId int) []model.Story {
	var stories []model.Story
	postRepo.db.Where("user_refer = ?", userId).Find(&stories)

	return stories
}

func (postRepo *PostRepository) GetUserStatusPosts(userId int) []model.Post {
	var statusPosts []model.Post
	postRepo.db.Where("user_refer = ? AND type = ?", userId, "STATUS").Find(&statusPosts)

	return statusPosts
}

func (postRepo *PostRepository) LikePost(postId int) {
	statusPost := &model.Post{}
	postRepo.db.Where("id = ?", postId).Find(&statusPost)

	statusPost.Likes = statusPost.Likes + 1
	postRepo.db.Save(&statusPost)
}

func (postRepo *PostRepository) DislikePost(postId int) {
	statusPost := &model.Post{}
	postRepo.db.Where("id = ?", postId).Find(&statusPost)

	statusPost.Likes = statusPost.Likes - 1
	postRepo.db.Save(&statusPost)
}

func (postRepo *PostRepository) SearchPublicPosts(searchParameter string) []model.Post {
	var users []userModel.User
	postRepo.db.Where("private_profile = ?", false).Find(&users)

	var myPosts []model.Post
	for _, oneUser := range users {
		userPosts := postRepo.GetUserStatusPosts(oneUser.ID)
		for _, onePost := range userPosts {

			if strings.Contains(strings.ToLower(onePost.Location), strings.ToLower(searchParameter)) {
				myPosts = append(myPosts, onePost)
				continue
			}

			for _, oneTag := range onePost.Tags {
				if strings.Contains(strings.ToLower(oneTag), strings.ToLower(searchParameter)) {
					myPosts = append(myPosts, userPosts...)
					break
				}
			}
		}
	}
	return myPosts
}

func (postRepo *PostRepository) CreateStatusPostPhoto(file *model.File, postId int) error {
	postRepo.db.Create(file)

	var post model.Post
	postRepo.db.Where("id = ?", postId).First(&post)

	post.ImageID = file.ID
	postRepo.db.Save(&post)

	return nil
}

func (postRepo *PostRepository) CreateStoryPhoto(file *model.File, storyId int) error {
	postRepo.db.Create(file)

	var story model.Story
	postRepo.db.Where("id = ?", storyId).First(&story)

	story.ImageID = file.ID
	postRepo.db.Save(&story)

	return nil
}

func (postRepo *PostRepository) FindIdByPath(path string) uint {
	var file model.File
	postRepo.db.Where("path = ? ", path).First(&file)
	return file.ID
}

func (postRepo *PostRepository) FindFilePathById(imageID uint) string {
	var file model.File
	postRepo.db.Where("id = ? ", imageID).First(&file)
	return file.Path
}

func (postRepo *PostRepository) GetAllPostPhotos() []model.File {
	var postPhotos []model.File
	postRepo.db.Find(&postPhotos)

	return postPhotos
}

func (postRepo *PostRepository) CreateNewComment(currentUserId int, postId int, text string) int {
	newComment := model.Comment{
		PostID: postId,
		UserID: currentUserId,
		Text:   text}

	postRepo.db.Create(&newComment)

	return newComment.ID
}

func (postRepo *PostRepository) GetPostComments(postId int) []model.Comment {
	var comments []model.Comment
	postRepo.db.Where("post_id = ?", postId).Find(&comments)

	return comments
}

func (postRepo *PostRepository) RemoveComment(commentId int) int {
	comment := model.Comment{}
	postRepo.db.Where("id = ?", commentId).Delete(&comment)

	return comment.ID
}

func (postRepo *PostRepository) AddToFavourites(postId string, userId string) {
	user := &userModel.User{}
	postRepo.db.Where("id = ?", userId).First(&user)

	post := &model.Post{}
	postRepo.db.Where("id = ?", postId).First(&post)

	user.FavouritePosts = append(user.FavouritePosts, int64(post.ID))
	postRepo.db.Save(&user)
}

func (postRepo *PostRepository) RemoveFromFavourites(postId string, userId string) {
	user := &userModel.User{}
	postRepo.db.Where("id = ?", userId).First(&user)

	postInt, _ := strconv.Atoi(postId)
	for i, post := range user.FavouritePosts {
		if post == int64(postInt) {
			user.FavouritePosts = append(user.FavouritePosts[:i], user.FavouritePosts[i+1:]...)
			postRepo.db.Save(&user)
		}
	}
}

func (postRepo *PostRepository) GetUserFavourites(userId string) pq.Int64Array {
	var user userModel.User
	postRepo.db.Where("id = ?", userId).First(&user)

	return user.FavouritePosts
}
