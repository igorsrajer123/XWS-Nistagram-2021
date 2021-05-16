# Start from the latest golang base image
FROM golang:1.16-alpine3.13
LABEL maintainer="Igor Srajer <igorsrajer123@gmail.com>"
WORKDIR /api
RUN apk update \
    && apk add build-base
COPY go.mod .
COPY go.sum .
RUN go mod download
COPY . .
RUN go build -o user-service
EXPOSE 8080
CMD ["./user-service"]
