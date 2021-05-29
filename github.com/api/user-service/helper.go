package main

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/api/user-service/dto"
	"github.com/api/user-service/model"
)

func RenderJSON(w http.ResponseWriter, v interface{}) {
	js, err := json.Marshal(v)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}

func DecodeBody(r io.Reader) (*model.User, error) {
	dec := json.NewDecoder(r)
	dec.DisallowUnknownFields()
	var rt model.User
	if err := dec.Decode(&rt); err != nil {
		return nil, err
	}
	return &rt, nil
}

func FromUserToUserDto(user model.User) dto.UserDto {
	var userDto dto.UserDto

	userDto.ID = user.ID
	userDto.Email = user.Email
	userDto.FirstName = user.FirstName
	userDto.LastName = user.LastName
	userDto.Age = user.Age
	userDto.PhoneNumber = user.PhoneNumber

	return userDto
}
