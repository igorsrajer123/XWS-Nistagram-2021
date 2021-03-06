module github.com/api/post-service

go 1.16

require (
	github.com/api/user-service v1.0.0
	github.com/gorilla/mux v1.8.0
	github.com/jasonlvhit/gocron v0.0.1 // indirect
	github.com/lib/pq v1.10.2
	gorm.io/driver/postgres v1.1.0
	gorm.io/gorm v1.21.11
)

replace (
	github.com/api/post-service => ../../myapp/github.com/api/post-service
	github.com/api/user-service => ../../myapp/github.com/api/user-service
)
