# Event-Driven Microservices with NestJS, Kafka & PostgreSQL

A distributed microservices architecture built with NestJS and Apache Kafka implementing asynchronous communication patterns, transactional outbox, idempotency protection, retry handling, and event-driven workflows.

---

# Architecture

This project contains multiple NestJS microservices communicating asynchronously through Kafka topics.

## Services

- Order Service
- Payment Service
- Kafka Broker
- PostgreSQL Database
- Kafka UI

---

# Features

## Event-Driven Communication

Services communicate through Kafka events instead of direct synchronous calls.

### Example Flow

```text
Order Created -> Kafka Event -> Payment Service -> Payment Event -> Order Status Update
```

---

## Transactional Outbox Pattern

Implements the Outbox Pattern to guarantee reliable event publishing.

### Flow

1. Business transaction is saved to PostgreSQL
2. Event is stored in `outbox_events`
3. Background publisher sends events to Kafka
4. Event is marked as processed

This prevents message loss between database commits and Kafka publishing.

---

## Idempotency Support

Implements idempotency keys to avoid duplicated requests.

### Features

- Request hash validation
- Cached response storage
- Duplicate request detection
- Safe retry support

---

## Kafka Retry Handling

Uses Kafka retry strategies through `KafkaRetriableException`.

### Features

- Retryable consumer failures
- Configurable retry attempts
- Retry backoff support

---

## Prisma ORM

Database access is handled with Prisma.

### Features

- Typed database access
- Repository pattern
- Transaction support
- JSON field support

---

## Dockerized Infrastructure

The entire infrastructure runs through Docker Compose.

### Included

- Kafka
- PostgreSQL
- Kafka UI
- NestJS services

---

# Technologies

- NestJS
- Apache Kafka
- KafkaJS
- PostgreSQL
- Prisma ORM
- Docker
- Docker Compose
- TypeScript

---

# Kafka Topics

| Topic | Description |
|---|---|
| orders.events | Order lifecycle events |
| payment.events | Payment processing events |

---

# Environment Configuration

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://postgres:12345@127.0.0.1:5432/distributed-nest-db"
PORT=8080
```

The database credentials are already included inside `DATABASE_URL`, so separate variables such as `DATABASE_USER` and `DATABASE_PASSWORD` are not required.

---

# Running the Project

## Start Infrastructure

```bash
docker compose up --build
```

---

## Run Services Locally

```bash
npm install
npm run start:local
```

---

# Kafka UI

Available at:

```text
http://localhost:8070
```

---

# Main Concepts Implemented

- Event-driven architecture
- Distributed systems communication
- Transactional outbox pattern
- Idempotency pattern
- Retry handling
- Kafka consumers/producers
- Repository pattern
- DTO mapping
- Database transactions
- Asynchronous processing

---

# Future Improvements

- Dead Letter Topics (DLT)
- Saga orchestration
- Distributed tracing
- Circuit breakers
- Metrics & observability
- Kubernetes deployment
- Schema Registry
- Avro serialization

---

# Learning Goals

This repository was created to practice and understand:

- Distributed systems fundamentals
- Kafka event streaming
- NestJS microservices
- Reliable asynchronous communication
- Eventual consistency patterns
- Production-ready backend architecture