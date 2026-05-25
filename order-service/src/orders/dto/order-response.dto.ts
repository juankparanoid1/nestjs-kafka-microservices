import { OrderItemResponseDto } from './order-item-response.dto';

export class OrderResponseDto {
  id: string;
  userId: string;
  totalAmount: number;
  orderItems: OrderItemResponseDto[];
}
