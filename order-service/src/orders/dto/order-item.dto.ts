import { IsInt, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

export class OrderItemDto {
  @IsOptional()
  @IsUUID('4', {
    message: 'Item id must be a valid UUID',
  })
  id: string;

  @IsOptional()
  @IsUUID('4', {
    message: 'Order id must be a valid UUID',
  })
  orderId: string;

  @IsUUID('4', {
    message: 'Product id must be a valid UUID',
  })
  productId: string;

  @IsInt({
    message: 'Quantity must be an integer number',
  })
  @Min(1, {
    message: 'Quantity must be greater than 0',
  })
  quantity: number;

  @IsNumber(
    {
      maxDecimalPlaces: 2,
    },
    {
      message: 'The price for the item must be a number',
    },
  )
  @Min(0, {
    message: 'Price must be greater than 0',
  })
  price: number;
}
