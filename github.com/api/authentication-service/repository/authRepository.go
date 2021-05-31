package repository

import (
	"fmt"
	"log"
	"os"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	userModel "github.com/api/user-service/model"
)

type AuthRepository struct {
	db *gorm.DB
}

func New() (*AuthRepository, error) {
	authRepo := &AuthRepository{}

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

	authRepo.db = db
	return authRepo, nil
}

func (authRepo *AuthRepository) Close() error {
	db, err := authRepo.db.DB()
	if err != nil {
		return err
	}

	db.Close()
	return nil
}

func (authRepo *AuthRepository) CheckCredentials(email string, password string) bool {
	user := &userModel.User{}

	if result := authRepo.db.Where("email = ? ", email).First(&user); result.Error != nil {
		fmt.Println("User not found!")
		return false
	}

	if !comparePasswords(password, user.Password) {
		return false
	}

	return true
}

func comparePasswords(providedPassword string, userPassword string) bool {
	passErr := bcrypt.CompareHashAndPassword([]byte(userPassword), []byte(providedPassword))
	if passErr == bcrypt.ErrMismatchedHashAndPassword && passErr != nil {
		fmt.Println("Wrong password!")
		return false
	}

	return true
}

func (authRepo *AuthRepository) GetUserByEmail(email string) userModel.User {
	user := &userModel.User{}

	if result := authRepo.db.Where("email = ? ", email).First(&user); result.Error != nil {
		fmt.Println("User not found!")
		log.Fatal(result.Error)
	}

	return *user
}
