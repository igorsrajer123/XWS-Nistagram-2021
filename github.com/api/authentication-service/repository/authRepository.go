package repository

import (
	"fmt"
	"os"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/api/authentication-service/helper"
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
	_, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}

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

func Login(email string, pass string) map[string]interface{} {
	host := os.Getenv("DBHOST")
	dbuser := os.Getenv("USER")
	password := os.Getenv("PASSWORD")
	dbname := os.Getenv("DBNAME")
	dbport := os.Getenv("DBPORT")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Shanghai", host, dbuser, password, dbname, dbport)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return map[string]interface{}{"message": string(err.Error())}
	}

	user := &userModel.User{}
	if db.Where("email = ? ", email).First(&user) == nil {
		return map[string]interface{}{"message": "User not found!"}
	}

	passErr := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(pass))

	if passErr == bcrypt.ErrMismatchedHashAndPassword && passErr != nil {
		return map[string]interface{}{"message": "Wrong password!"}
	}

	var response = helper.PrepareResponse(user)

	return response
}
