# Start from the latest golang base image
FROM golang:1.16-alpine3.13
LABEL maintainer="Igor Srajer <igorsrajer123@gmail.com>"
ENV GO111MODULE=on
WORKDIR app
RUN apk update \
    && apk add build-base && apk add git
RUN git clone -b master https://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@github.com/igorsrajer123/XWS-Nistagram-2021 /myapp/
COPY go.mod .
COPY go.sum .
RUN go mod download
COPY . .
RUN go build -o scheduling-service
EXPOSE 8000
CMD ["./scheduling-service"]