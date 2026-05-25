import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { OrderItemDto } from './order-item.dto';
import { Type } from 'class-transformer';

export class OrderDto {
  @IsOptional()
  @IsUUID('4', {
    message: 'Order id must be a valid UUID',
  })
  id: string;

  @IsUUID('4', {
    message: 'User id must be a valid UUID',
  })
  @IsNotEmpty({
    message: 'User id must not be empty',
  })
  userId: string;

  @IsNumber(
    {},
    {
      message: 'The amount of the order must be a number',
    },
  )
  totalAmount: number;

  @IsArray({
    message: 'The order must have a list of items',
  })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];
}
