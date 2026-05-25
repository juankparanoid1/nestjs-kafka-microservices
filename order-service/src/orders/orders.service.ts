import { Injectable } from '@nestjs/common';
import { OrdersRepository } from './repositories/orders.repository/orders.repository';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrderDto } from './dto/order.dto';
import { OrderWithItems } from './types/order-with-items.type';
import { OrderMapper } from './mapper/order.mapper';
import { OutboxEventMapper } from './mapper/outbox-event.mapper';

@Injectable()
export class OrdersService {
  constructor(private ordersRepository: OrdersRepository) {}

  async createOrder(data: OrderDto): Promise<OrderResponseDto> {
    const orderSaved: OrderWithItems = await this.ordersRepository.create(
      OrderMapper.toPersistance(data),
    );
    await this.ordersRepository.createOutboxEvent(
      OutboxEventMapper.toPersistance(orderSaved),
    );
    return OrderMapper.toResponse(orderSaved);
  }
}
