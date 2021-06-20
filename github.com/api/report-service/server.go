package main

import (
	"mime"
	"net/http"

	"github.com/api/report-service/repository"
)

type ReportServer struct {
	reportRepo *repository.ReportRepository
}

func NewReportServer() (*ReportServer, error) {
	reportRepo, err := repository.New()
	if err != nil {
		return nil, err
	}

	return &ReportServer{
		reportRepo: reportRepo,
	}, nil
}

func (server *ReportServer) CloseDB() error {
	return server.reportRepo.Close()
}

func (server *ReportServer) SubmitReportHandler(w http.ResponseWriter, req *http.Request) {
	contentType := req.Header.Get("Content-Type")
	mediatype, _, err := mime.ParseMediaType(contentType)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if mediatype != "application/json" {
		http.Error(w, "expect application/json Content-Type", http.StatusUnsupportedMediaType)
		return
	}

	report, err := DecodeBody(req.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	id := server.reportRepo.SubmitReport(report.PostId, report.ReportReason, report.ReportType)
	RenderJSON(w, id)
}

func (server *ReportServer) GetAllReportsHandler(w http.ResponseWriter, req *http.Request) {
	allReports := server.reportRepo.GetAllReports()

	RenderJSON(w, allReports)
}
