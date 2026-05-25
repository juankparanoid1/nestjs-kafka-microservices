import { PaymentProvider } from '../enum/payment-provider.enum';
import { PaymentStatus } from '../enum/payment-status.enum';

export class PaymentCompletedEvent {
  paymentId!: string;
  orderId!: string;
  amount!: number;
  status!: PaymentStatus;
  provider!: PaymentProvider;
  transactionReference!: string;
}
