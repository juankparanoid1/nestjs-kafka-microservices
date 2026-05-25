/*
  Warnings:

  - You are about to drop the `Inventory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderItems` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Orders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `idempotencyKeys` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `outboxEvents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `processedEvents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrderItems" DROP CONSTRAINT "OrderItems_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Payments" DROP CONSTRAINT "Payments_orderId_fkey";

-- DropTable
DROP TABLE "Inventory";

-- DropTable
DROP TABLE "OrderItems";

-- DropTable
DROP TABLE "Orders";

-- DropTable
DROP TABLE "Payments";

-- DropTable
DROP TABLE "idempotencyKeys";

-- DropTable
DROP TABLE "outboxEvents";

-- DropTable
DROP TABLE "processedEvents";

-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "status" VARCHAR(30) NOT NULL,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "order_id" UUID NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "status" VARCHAR(30) NOT NULL,
    "provider" VARCHAR(50) NOT NULL,
    "transaction_reference" VARCHAR(100) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "available_quantity" INTEGER NOT NULL,
    "reserved_quantity" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outbox_events" (
    "id" UUID NOT NULL,
    "aggregate_type" VARCHAR(50) NOT NULL,
    "aggregate_id" UUID NOT NULL,
    "event_type" VARCHAR(50) NOT NULL,
    "payload" JSONB NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "outbox_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "processed_events" (
    "id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "service_name" VARCHAR(50) NOT NULL,
    "processed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "processed_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "idempotency_keys" (
    "id" UUID NOT NULL,
    "idempotency_key" VARCHAR(255) NOT NULL,
    "request_hash" VARCHAR(255) NOT NULL,
    "response" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "idempotency_keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_order_items_order_id" ON "order_items"("order_id");

-- CreateIndex
CREATE INDEX "idx_payments_order_id" ON "payments"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_product_id_key" ON "inventory"("product_id");

-- CreateIndex
CREATE INDEX "idx_outbox_processed" ON "outbox_events"("processed");

-- CreateIndex
CREATE INDEX "aggregate_id" ON "outbox_events"("aggregate_id");

-- CreateIndex
CREATE UNIQUE INDEX "processed_events_event_id_service_name_key" ON "processed_events"("event_id", "service_name");

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
