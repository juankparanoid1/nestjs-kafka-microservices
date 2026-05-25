import { randomUUID } from 'crypto';
import { OrderEvents } from '../enum/order-events.enum';
import { OrderWithItems } from '../types/order-with-items.type';

export class OutboxEventMapper {
  static toPersistance(order: OrderWithItems) {
    return {
      aggregate_id: order.id,
      aggregate_type: 'ORDER',
      event_type: OrderEvents.CREATED,
      payload: this.buildPayload(order),
      processed: false,
    };
  }

  static buildPayload(order: OrderWithItems) {
    return {
      id: order.id,
      eventId: randomUUID(),
      userId: order.user_id,
      totalAmount: order.total_amount.toNumber(),
      items: order.order_items.map((item) => {
        return {
          id: item.id,
          orderId: item.order_id,
          price: item.price.toNumber(),
          productId: item.product_id,
          quantity: item.quantity.toNumber(),
        };
      }),
    };
  }
}
