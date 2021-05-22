package repository

import (
	"fmt"
	"os"

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
	userRepo.db.Preload("").Find(&users)

	return users
}

func (userRepo *UserRepository) CreateUser(email string, password string, firstName string, lastName string) int {
	passHash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	user := model.User{
		Email:     email,
		Password:  string(passHash),
		FirstName: firstName,
		LastName:  lastName}

	if err != nil {
		fmt.Println(err)
	}

	fmt.Println("New hashed user password is: " + user.Password)

	userRepo.db.Create(&user)

	return int(user.ID)
}