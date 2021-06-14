module github.com/api/user-service

go 1.16

require (
	github.com/gorilla/mux v1.8.0
	github.com/lib/pq v1.10.2 // indirect
	golang.org/x/crypto v0.0.0-20210513164829-c07d793c2f9a
	gorm.io/driver/postgres v1.1.0
	gorm.io/gorm v1.21.10
)

replace github.com/api/post-service => ../../myapp/github.com/api/post-service
