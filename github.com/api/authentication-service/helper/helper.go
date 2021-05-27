package helper

import (
	"fmt"
	"os"
	"time"

	"github.com/form3tech-oss/jwt-go"
)

func GenerateJWT(email, role string) (string, error) {
	os.Setenv("SECRET_KEY", "secret")
	var mySigningKey = []byte(os.Getenv("SECRET_KEY"))
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)

	claims["authorized"] = true
	claims["email"] = email
	claims["role"] = role
	claims["exp"] = time.Now().Add(time.Minute * 30).Unix()

	tokenString, err := token.SignedString(mySigningKey)

	if err != nil {
		fmt.Errorf("Something Went Wrong: %s", err.Error())
		return "", err
	}

	fmt.Println("Token izgenerisan!")
	return tokenString, nil
}
