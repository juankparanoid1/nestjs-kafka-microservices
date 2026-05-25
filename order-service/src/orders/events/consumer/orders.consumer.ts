import { Injectable, Logger } from '@nestjs/common';
import {
  EventPattern,
  KafkaRetriableException,
  Payload,
} from '@nestjs/microservices';
import { PaymentCompletedEvent } from '../payment-completed.event';
import { PrismaService } from 'src/prisma.service';
import { PaymentStatus } from 'src/orders/enum/payment-status.enum';
import { OrderStatus } from 'src/orders/enum/order-status.enum';

@Injectable()
export class OrdersConsumer {
  private readonly logger = new Logger(OrdersConsumer.name);

  private static readonly PAYMENT_ORDER_STATUS: Record<
    PaymentStatus,
    OrderStatus
  > = {
    [PaymentStatus.PAYMENT_COMPLETED]: OrderStatus.PAID,

    [PaymentStatus.PAYMENT_FAILED]: OrderStatus.PAYMENT_FAILED,

    [PaymentStatus.PAYMENT_IN_PROGRESS]: OrderStatus.PENDING_PAYMENT,
  };

  constructor(private prisma: PrismaService) {}

  @EventPattern('payment.events')
  async consumePayment(@Payload() data: PaymentCompletedEvent) {
    this.logger.log('Processing order paid', data);

    try {
      const order = await this.prisma.orders.findFirst({
        where: {
          id: data.orderId,
        },
      });
      if (!order) return;
      await this.prisma.orders.update({
        where: {
          id: order.id,
        },
        data: {
          status: OrdersConsumer.PAYMENT_ORDER_STATUS[data.status],
        },
      });
    } catch (error) {
      this.logger.warn(`Execution failed. Triggering standard retry policy...`);
      throw new KafkaRetriableException(
        error instanceof Error
          ? error
          : new Error('Unknown exception sent to retry'),
      );
    }
  }
}
