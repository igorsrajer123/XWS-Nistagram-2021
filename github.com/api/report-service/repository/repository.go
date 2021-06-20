package repository

import (
	"fmt"
	"os"

	"github.com/api/report-service/model"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type ReportRepository struct {
	db *gorm.DB
}

func New() (*ReportRepository, error) {
	reportRepo := &ReportRepository{}

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
	reportRepo.db = db
	reportRepo.db.AutoMigrate(&model.Report{})

	return reportRepo, nil
}

func (reportRepository *ReportRepository) Close() error {
	db, err := reportRepository.db.DB()
	if err != nil {
		return err
	}

	db.Close()
	return nil
}

func (reportRepository *ReportRepository) SubmitReport(postId int, reportReason string, reportType string) int {
	report := model.Report{
		ReportReason: reportReason,
		ReportType:   reportType,
		PostId:       postId}

	reportRepository.db.Create(&report)

	return report.ID
}

func (reportRepository *ReportRepository) GetAllReports() []model.Report {
	var reports []model.Report
	reportRepository.db.Find(&reports)

	return reports
}
