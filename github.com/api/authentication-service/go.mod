module github.com/api/authentication-service

go 1.16

require (
	github.com/api/user-service v1.0.0
	github.com/form3tech-oss/jwt-go v3.2.3+incompatible
	github.com/gorilla/mux v1.8.0
	golang.org/x/crypto v0.0.0-20210513164829-c07d793c2f9a
	gorm.io/driver/postgres v1.1.0
	gorm.io/gorm v1.21.10
)

replace github.com/api/user-service => ../../myapp/github.com/api/user-service
