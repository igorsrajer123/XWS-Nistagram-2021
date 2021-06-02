package repository

import (
	"fmt"
	"os"
	"strings"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

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
		Website:     website}

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
