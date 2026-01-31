# Stage 1: Build the Go application
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Copy go.mod and go.sum to download dependencies first
# This leverages Docker layer caching
COPY go.mod go.sum ./
RUN go mod download

# Copy the entire backend source code
COPY . .

# Build the main API executable
# The main package is located in the cmd/api directory
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o main ./cmd/api

# Stage 2: Create a minimal production image
FROM alpine:latest

WORKDIR /app

# Copy the built binary from the builder stage
COPY --from=builder /app/main .

# The API server listens on port 8080 by default
EXPOSE 8080

# Command to run the executable
CMD ["./main"]
