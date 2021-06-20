package model

type Report struct {
	ID           int    `json:"id" gorm:"primaryKey"`
	ReportReason string `json:"reportReason"`
	PostId       int    `json:"postId"`
	ReportType   string `json:"reportType"`
}
