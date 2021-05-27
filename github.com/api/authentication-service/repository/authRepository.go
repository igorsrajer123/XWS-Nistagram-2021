package repository

import (
	"fmt"
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

func (authRepo *AuthRepository) CheckCredentials(email string, password string) bool {
	user := &userModel.User{}
	fmt.Println("Izavrsava se metodaaaa1!")
	if authRepo.db.Where("email = ? ", email).First(&user) == nil {
		fmt.Println("User not found!")
		return false
	}
	fmt.Println("Izavrsava se metoda2!")
	passErr := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if passErr == bcrypt.ErrMismatchedHashAndPassword && passErr != nil {
		fmt.Println("Wrong password!")
		return false
	}
	fmt.Println("Kredencijali ispravni!")
	return true
}
