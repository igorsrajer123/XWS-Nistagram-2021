module github.com/api/authentication-service

go 1.16

require (
	github.com/api/user-service v1.0.0
	github.com/api/post-service v1.0.0
	github.com/form3tech-oss/jwt-go v3.2.3+incompatible
	github.com/gomodule/redigo v1.8.4 // indirect
	github.com/gorilla/handlers v1.5.1 // indirect
	github.com/gorilla/mux v1.8.0
	github.com/gorilla/securecookie v1.1.1 // indirect
	github.com/rs/cors v1.7.0 // indirect
	golang.org/x/crypto v0.0.0-20210513164829-c07d793c2f9a
	gorm.io/driver/postgres v1.1.0
	gorm.io/gorm v1.21.10
)

replace (
	github.com/api/user-service => ../../myapp/github.com/api/user-service
	github.com/api/post-service => ../../myapp/github.com/api/post-service
	)
