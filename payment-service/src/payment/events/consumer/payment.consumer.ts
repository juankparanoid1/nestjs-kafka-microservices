import { Controller, Logger } from '@nestjs/common';
import {
  EventPattern,
  KafkaRetriableException,
  Payload,
} from '@nestjs/microservices';
import { PrismaService } from 'src/prisma.service';
import { OrderCreatedEvent } from '../order-created.event';
import { PaymentProvider } from 'src/payment/enum/payment-provider.enum';
import { PaymentStatus } from 'src/payment/enum/payment-status.enum';
import { randomUUID } from 'crypto';
import { OutboxEventMapper } from 'src/payment/mapper/outbox-event.mapper';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Controller()
export class PaymentConsumer {
  private readonly logger = new Logger(PaymentConsumer.name);
  private readonly SERVICE_NAME = 'payment-service';

  constructor(private prisma: PrismaService) {}

  @EventPattern('orders.events')
  async consumeOrderCreated(
    @Payload() data: OrderCreatedEvent,
    // @Ctx() context: KafkaContext,
  ) {
    try {
      //   const processed = await this.prisma.processedEvents.findFirst({
      //     where: {
      //       eventId: data.eventId,
      //       serviceName: this.SERVICE_NAME,
      //     },
      //   });

      //   if (processed) return;
      this.logger.log('Processing order created', data);

      await this.prisma.$transaction(async (tx) => {
        const payment = await tx.payments.create({
          data: {
            amount: data.totalAmount,
            orderId: data.id,
            provider: PaymentProvider.STRIPE,
            status: PaymentStatus.PAYMENT_COMPLETED,
            transactionReference: randomUUID(),
          },
        });

        await tx.outboxEvents.create({
          data: OutboxEventMapper.toPersistance(payment),
        });

        await tx.processedEvents.create({
          data: {
            eventId: data.eventId,
            serviceName: this.SERVICE_NAME,
          },
        });
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        this.logger.warn(`Event already processed: ${data.eventId}`);
        return;
      }
      this.logger.warn(`Execution failed. Triggering standard retry policy...`);
      throw new KafkaRetriableException(
        error instanceof Error
          ? error
          : new Error('Unknown exception sent to retry'),
      );
    }
  }
}
