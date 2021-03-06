package main

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/api/post-service/dto"
	"github.com/api/post-service/model"
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

func DecodeBody(r io.Reader) (*dto.PostDto, error) {
	dec := json.NewDecoder(r)
	dec.DisallowUnknownFields()
	var rt dto.PostDto
	if err := dec.Decode(&rt); err != nil {
		return nil, err
	}
	return &rt, nil
}

func DecodeComment(r io.Reader) (*model.Comment, error) {
	dec := json.NewDecoder(r)
	dec.DisallowUnknownFields()
	var rt model.Comment
	if err := dec.Decode(&rt); err != nil {
		return nil, err
	}
	return &rt, nil
}
