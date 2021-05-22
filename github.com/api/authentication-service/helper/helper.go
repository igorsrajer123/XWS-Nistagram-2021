package helper

import (
	"time"

	userModel "github.com/api/user-service/model"

	"github.com/form3tech-oss/jwt-go"

	"github.com/api/authentication-service/model"
)

func PrepareToken(user *userModel.User) string {
	tokenContent := jwt.MapClaims{
		"user_id": user.ID,
		"expiry":  time.Now().Add(time.Minute * 20).Unix(),
	}
	jwtToken := jwt.NewWithClaims(jwt.GetSigningMethod("HS256"), tokenContent)
	token, err := jwtToken.SignedString([]byte("TokenPassword"))
	if err != nil {
		panic(err.Error())
	}

	return token
}

func PrepareResponse(user *userModel.User) map[string]interface{} {
	responseUser := &model.ResponseUser{
		ID:        uint(user.ID),
		Email:     user.Email,
		FirstName: user.FirstName,
		LastName:  user.LastName,
	}

	var token = PrepareToken(user)
	var response = map[string]interface{}{"message": "All is fine!"}
	response["jwt"] = token
	response["data"] = responseUser

	return response
}
