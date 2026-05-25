import { Prisma } from 'src/generated/prisma/client';
import { OrderResponseDto } from '../dto/order-response.dto';
import { OrderDto } from '../dto/order.dto';
import { OrderStatus } from '../enum/order-status.enum';

type OrderWithItems = Prisma.ordersGetPayload<{
  include: { order_items: true };
}>;

export class OrderMapper {
  static toPersistance(dto: OrderDto): Prisma.ordersCreateInput {
    return {
      user_id: dto.userId,
      status: OrderStatus.CREATED,
      total_amount: dto.totalAmount,
      order_items: {
        create: dto.orderItems.map((item) => {
          return {
            product_id: item.productId,
            quantity: item.quantity,
            price: item.price,
          };
        }),
      },
    };
  }

  static toResponse(order: OrderWithItems): OrderResponseDto {
    return {
      id: order.id,
      userId: order.user_id,
      totalAmount: order.total_amount.toNumber(),
      orderItems: order.order_items.map((item) => {
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

  static toDto(order: OrderDto): OrderDto {
    return {
      id: order.id,
      userId: order.userId,
      totalAmount: order.totalAmount,
      orderItems: order.orderItems.map((item) => {
        return {
          id: item.id,
          orderId: item.orderId,
          price: item.price,
          productId: item.productId,
          quantity: item.quantity,
        };
      }),
    };
  }
}
