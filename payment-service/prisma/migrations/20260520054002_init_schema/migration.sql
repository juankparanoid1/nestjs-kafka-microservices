-- CreateTable
CREATE TABLE "Orders" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "status" VARCHAR(30) NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItems" (
    "id" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "orderId" UUID NOT NULL,

    CONSTRAINT "OrderItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payments" (
    "id" UUID NOT NULL,
    "orderId" UUID NOT NULL,
    "status" VARCHAR(30) NOT NULL,
    "provider" VARCHAR(50) NOT NULL,
    "transactionReference" VARCHAR(100) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "availableQuantity" INTEGER NOT NULL,
    "reservedQuantity" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outboxEvents" (
    "id" UUID NOT NULL,
    "aggregateType" VARCHAR(50) NOT NULL,
    "aggregateId" UUID NOT NULL,
    "eventType" VARCHAR(50) NOT NULL,
    "payload" JSONB NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "outboxEvents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "processedEvents" (
    "id" UUID NOT NULL,
    "eventId" UUID NOT NULL,
    "serviceName" VARCHAR(50) NOT NULL,
    "processed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "processedEvents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "idempotencyKeys" (
    "id" UUID NOT NULL,
    "idempotencyKey" VARCHAR(255) NOT NULL,
    "requestHash" VARCHAR(255) NOT NULL,
    "response" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "idempotencyKeys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_order_items_order_id" ON "OrderItems"("orderId");

-- CreateIndex
CREATE INDEX "idx_payments_order_id" ON "Payments"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_productId_key" ON "Inventory"("productId");

-- CreateIndex
CREATE INDEX "idx_outbox_processed" ON "outboxEvents"("processed");

-- CreateIndex
CREATE INDEX "aggregate_id" ON "outboxEvents"("aggregateId");

-- CreateIndex
CREATE UNIQUE INDEX "processedEvents_eventId_serviceName_key" ON "processedEvents"("eventId", "serviceName");

-- AddForeignKey
ALTER TABLE "OrderItems" ADD CONSTRAINT "OrderItems_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
