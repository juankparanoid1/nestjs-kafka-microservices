import { OrderItemEvent } from './order-item.event';

export class OrderCreatedEvent {
  id!: string;
  eventId!: string;
  userId!: string;
  totalAmount!: number;
  items!: OrderItemEvent[];
}
