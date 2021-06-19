package main

import (
	"fmt"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	storyModel "github.com/api/post-service/model"
)

type SchedulingRepository struct {
	db *gorm.DB
}

func New() (*SchedulingRepository, error) {
	schRepo := &SchedulingRepository{}

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
	schRepo.db = db
	return schRepo, nil
}

func (schRepo *SchedulingRepository) Close() error {
	db, err := schRepo.db.DB()
	if err != nil {
		return err
	}

	db.Close()
	return nil
}

func (schRepo *SchedulingRepository) CheckVisiblity() {
	var stories []storyModel.Story
	schRepo.db.Find(&stories)

	timeNow := time.Now()
	for _, story := range stories {
		difference := timeNow.Sub(story.Published)
		hours := int(difference.Hours())
		if hours >= 22 {
			story.Visible = false
			schRepo.db.Save(&story)
		}
	}
}
