module github.com/api/report-service

go 1.16

require (
	github.com/api/post-service v1.0.0
	github.com/gorilla/mux v1.8.0
	github.com/lib/pq v1.10.2 // indirect
	golang.org/x/crypto v0.0.0-20210616213533-5ff15b29337e // indirect
	gorm.io/driver/postgres v1.1.0
	gorm.io/gorm v1.21.11
)

replace (
	github.com/api/post-service => ../../myapp/github.com/api/post-service
	github.com/api/user-service => ../../myapp/github.com/api/user-service
)
