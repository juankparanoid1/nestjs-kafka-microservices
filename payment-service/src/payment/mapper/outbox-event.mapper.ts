import { PaymentCompletedEvent } from '../events/payment-completed.event';
import { Payment } from '../types/payment.type';
import { PaymentStatus } from '../enum/payment-status.enum';
import { PaymentProvider } from '../enum/payment-provider.enum';
import { Prisma } from 'src/generated/prisma/client';

export class OutboxEventMapper {
  static toPersistance(payment: Payment): Prisma.OutboxEventsCreateInput {
    return {
      aggregateId: payment.id,
      aggregateType: 'PAYMENT',
      eventType: PaymentStatus.PAYMENT_COMPLETED,
      payload: this.buildPayload(payment) as unknown as Prisma.InputJsonValue,
      processed: false,
    };
  }

  static buildPayload(payment: Payment): PaymentCompletedEvent {
    return {
      paymentId: payment.id,
      orderId: payment.orderId,
      amount: payment.amount.toNumber(),
      status: payment.status as PaymentStatus,
      provider: payment.provider as PaymentProvider,
      transactionReference: payment.transactionReference,
    };
  }
}
