# Start from the latest golang base image
FROM golang:1.16-alpine3.13
LABEL maintainer="Igor Srajer <igorsrajer123@gmail.com>"
ENV GO111MODULE=on
WORKDIR app
RUN apk update \
    && apk add build-base
COPY go.mod .
COPY go.sum .
RUN go mod download
COPY . .
RUN go build -o post-service
EXPOSE 8000
CMD ["./post-service"]