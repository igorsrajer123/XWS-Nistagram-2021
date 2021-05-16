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
RUN go build -o authentication-service
EXPOSE 8000
CMD ["./authentication-service"]