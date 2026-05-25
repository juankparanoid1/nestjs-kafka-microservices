import { PaymentProvider } from '../enum/payment-provider.enum';
import { PaymentStatus } from '../enum/payment-status.enum';
import { PaymentCompletedEvent } from '../events/payment-completed.event';
import { Payment } from '../types/payment.type';

export class PaymentCompletedMapper {
  static toPaymentCompletedEvent(payment: Payment): PaymentCompletedEvent {
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
