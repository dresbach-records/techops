# Stage 1: Build the Go application
FROM golang:1.22-alpine AS builder
WORKDIR /app

# Copy go.mod and go.sum files to download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the entire backend source code
COPY . .

# Build the API server binary. The main.go for the API is in cmd/api
# The output binary is placed in the root of the image for simplicity.
RUN CGO_ENABLED=0 GOOS=linux go build -o /api-server ./cmd/api

# Stage 2: Create a minimal final image from scratch for security
FROM alpine:latest
WORKDIR /root/

# Copy the binary from the builder stage
COPY --from=builder /api-server .

# Expose the port the API server will run on (default is 8080)
EXPOSE 8080

# Command to run the executable
CMD ["./api-server"]
