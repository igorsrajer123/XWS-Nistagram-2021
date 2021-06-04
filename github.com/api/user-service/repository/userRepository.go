package repository

import (
	"fmt"
	"os"
	"strconv"
	"strings"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"

	"github.com/api/user-service/model"
)

type UserRepository struct {
	db *gorm.DB
}

func New() (*UserRepository, error) {
	userRepo := &UserRepository{}

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
	userRepo.db = db
	userRepo.db.AutoMigrate(&model.User{})
	userRepo.db.AutoMigrate(&model.FollowRequest{})

	return userRepo, nil
}

func (userRepo *UserRepository) Close() error {
	db, err := userRepo.db.DB()
	if err != nil {
		return err
	}

	db.Close()
	return nil
}

func (userRepo *UserRepository) GetAllUsers() []model.User {
	var users []model.User
	userRepo.db.Find(&users)

	return users
}

func (userRepo *UserRepository) GetUserById(id int) model.User {
	var user model.User
	userRepo.db.Where("id = ?", id).First(&user)
	return user
}

func (userRepo *UserRepository) GetUserByEmail(email string) model.User {
	var user model.User
	userRepo.db.Where("email = ?", email).First(&user)
	return user
}

func (userRepo *UserRepository) CheckIfUserExistsByEmail(email string) bool {
	var user model.User

	if result := userRepo.db.Where("email = ? ", email).First(&user); result.Error != nil {
		fmt.Println("User not found!")
		return false
	}

	return true
}

func (userRepo *UserRepository) CreateUser(email string, password string, firstName string, lastName string,
	age int, phoneNumber string, gender string, location string, website string) int {
	passHash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	user := model.User{
		Email:       email,
		Password:    string(passHash),
		FirstName:   firstName,
		LastName:    lastName,
		Age:         age,
		PhoneNumber: phoneNumber,
		Gender:      gender,
		Location:    location,
		Website:     website,
		Followings:  nil,
		Followers:   nil}

	if err != nil {
		fmt.Println(err)
	}

	userRepo.db.Create(&user)

	return int(user.ID)
}

func (userRepo *UserRepository) EditUser(email string, firstName string, lastName string, age int, phoneNumber string,
	location string, website string, description string) model.User {
	user := &model.User{}
	userRepo.db.Where("email = ?", email).First(&user)

	user.Age = age
	user.Description = description
	user.FirstName = firstName
	user.LastName = lastName
	user.Age = age
	user.PhoneNumber = phoneNumber
	user.Website = website
	user.Location = location

	userRepo.db.Save(&user)

	return *user
}

func (userRepo *UserRepository) ChangeUserPassword(email string, newPassword string) int {
	passHash, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		fmt.Println(err)
	}

	user := &model.User{}
	userRepo.db.Where("email = ?", email).First(&user)

	user.Password = string(passHash)

	userRepo.db.Save(&user)

	return user.ID
}

func (userRepo *UserRepository) ToggleProfilePrivacy(id int) {
	user := &model.User{}
	userRepo.db.Where("id = ?", id).First(&user)

	if *user.PrivateProfile {
		*user.PrivateProfile = false
	} else {
		*user.PrivateProfile = true
	}

	userRepo.db.Save(&user)
}

func (userRepo *UserRepository) SearchPublicProfiles(searchParameter string) []model.User {
	var users []model.User
	userRepo.db.Where("private_profile = ?", false).Find(&users)

	var myUsers []model.User
	for _, oneUser := range users {
		if strings.Contains(strings.ToLower(oneUser.Location), strings.ToLower(searchParameter)) ||
			strings.Contains(strings.ToLower(oneUser.LastName), strings.ToLower(searchParameter)) ||
			strings.Contains(strings.ToLower(oneUser.Location), strings.ToLower(searchParameter)) ||
			strings.Contains(strings.ToLower(oneUser.FirstName)+" "+strings.ToLower(oneUser.LastName), strings.ToLower(searchParameter)) ||
			strings.Contains(strings.ToLower(oneUser.LastName)+" "+strings.ToLower(oneUser.FirstName), strings.ToLower(searchParameter)) {

			myUsers = append(myUsers, oneUser)
		}
	}
	return myUsers
}

func (userRepo *UserRepository) SearchAllProfiles(searchParameter string) []model.User {
	var users []model.User
	userRepo.db.Find(&users)

	var myUsers []model.User
	for _, oneUser := range users {
		if strings.Contains(strings.ToLower(oneUser.Location), strings.ToLower(searchParameter)) ||
			strings.Contains(strings.ToLower(oneUser.LastName), strings.ToLower(searchParameter)) ||
			strings.Contains(strings.ToLower(oneUser.Location), strings.ToLower(searchParameter)) ||
			strings.Contains(strings.ToLower(oneUser.FirstName)+" "+strings.ToLower(oneUser.LastName), strings.ToLower(searchParameter)) ||
			strings.Contains(strings.ToLower(oneUser.LastName)+" "+strings.ToLower(oneUser.FirstName), strings.ToLower(searchParameter)) {

			myUsers = append(myUsers, oneUser)
		}
	}
	return myUsers
}

func (userRepo *UserRepository) Follow(currentUserId string, followUserId string) int {
	currentUser := &model.User{}
	userRepo.db.Preload(clause.Associations).Where("id = ?", currentUserId).First(&currentUser)

	followUser := &model.User{}
	userRepo.db.Preload(clause.Associations).Where("id = ?", followUserId).First(&followUser)

	if *followUser.PrivateProfile {
		fmt.Println("This profile is private......!")

		followUserIdInt, _ := strconv.Atoi(followUserId)
		followerUserIdInt2, _ := strconv.Atoi(currentUserId)

		followRequest := model.FollowRequest{
			SentById: followerUserIdInt2,
			SentToId: followUserIdInt,
			Status:   "PENDING"}

		userRepo.db.Create(&followRequest)

		return 1
	} else {
		currentUser.Followings = append(currentUser.Followings, followUser)
		userRepo.db.Omit("Followings.*").Save(&currentUser)

		followUser.Followers = append(followUser.Followers, currentUser)
		userRepo.db.Omit("Followers.*").Save(&followUser)

		return 2
	}
}

func (userRepo *UserRepository) Unfollow(currentUserId string, followUserId string) {
	currentUser := &model.User{}
	userRepo.db.Preload("Followings").Preload("Followers").Where("id = ?", currentUserId).First(&currentUser)

	followUser := &model.User{}
	userRepo.db.Preload("Followers").Preload("Followings").Where("id = ?", followUserId).First(&followUser)

	followUserIdInt, _ := strconv.Atoi(followUserId)
	for i, oneUser := range currentUser.Followings {
		if oneUser.ID == followUserIdInt {
			currentUser.Followings = append(currentUser.Followings[:i], currentUser.Followings[i+1:]...)
			userRepo.db.Save(&currentUser)
		}
	}

	followerUserIdInt2, _ := strconv.Atoi(currentUserId)
	for i, oneUser := range followUser.Followers {
		if oneUser.ID == followerUserIdInt2 {
			followUser.Followers = append(followUser.Followers[:i], followUser.Followers[i+1:]...)
			userRepo.db.Save(&oneUser)
		}
	}
}

//followings - users that our user follows
func (userRepo *UserRepository) GetUserFollowings(currentUserId string) []*model.User {
	var currentUser model.User
	userRepo.db.Preload("Followings").Where("id = ?", currentUserId).First(&currentUser)

	return currentUser.Followings
}

//followers - users that follow our user
func (userRepo *UserRepository) GetUserFollowers(currentUserId string) []*model.User {
	var currentUser model.User
	userRepo.db.Preload("Followers").Where("id = ?", currentUserId).First(&currentUser)

	return currentUser.Followers
}

func (userRepo *UserRepository) GetUserActiveFollowRequests(userId string) []model.FollowRequest {
	var user model.User
	userRepo.db.Where("id = ?", userId).First(&user)

	var requests []model.FollowRequest
	userRepo.db.Where("sent_to_id = ? AND status = ?", user.ID, "PENDING").Find(&requests)

	return requests
}
