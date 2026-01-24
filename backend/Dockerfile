FROM golang:1.25-alpine AS builder
WORKDIR /app
COPY . .

RUN go build -o server cmd/server/main.go

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/server .
COPY --from=builder /app/internal/database/migration ./migrations

EXPOSE 5000
CMD ["./server"]