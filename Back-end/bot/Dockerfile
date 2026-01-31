# Stage 1: Build the Go application
FROM golang:1.22-alpine AS builder
WORKDIR /app

# The bot has its own go.mod file
COPY go.mod go.sum ./
RUN go mod download

# Copy the bot source code
COPY . .

# Build the Bot server binary. The main.go is at the root of the bot directory.
RUN CGO_ENABLED=0 GOOS=linux go build -o /bot-server .

# Stage 2: Create a minimal final image from scratch
FROM alpine:latest
WORKDIR /root/

# Copy the binary from the builder stage
COPY --from=builder /bot-server .

# Expose the port the Bot server will run on (default is 8081)
EXPOSE 8081

# Command to run the executable
CMD ["./bot-server"]
