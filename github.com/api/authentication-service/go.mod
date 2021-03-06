module github.com/api/authentication-service

go 1.16

require (
	github.com/api/user-service v0.0.0-00010101000000-000000000000
	github.com/form3tech-oss/jwt-go v3.2.3+incompatible
	github.com/gorilla/handlers v1.5.1
	github.com/gorilla/mux v1.8.0
	golang.org/x/crypto v0.0.0-20210513164829-c07d793c2f9a
	gorm.io/driver/postgres v1.1.0
	gorm.io/gorm v1.21.11
)

replace (
	github.com/api/post-service => ../../myapp/github.com/api/post-service
	github.com/api/user-service => ../../myapp/github.com/api/user-service
)
