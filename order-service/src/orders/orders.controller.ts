import { Body, Controller, Headers, Logger, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderDto } from './dto/order.dto';
import { createHash } from 'crypto';
import { IdempotencyKeyService } from 'src/idempotency-key/idempotency-key.service';

@Controller('order')
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);
  constructor(
    private ordersService: OrdersService,
    private idempotencyKeyService: IdempotencyKeyService,
  ) {}

  @Post('create')
  async createOrder(
    @Body() orderDto: OrderDto,
    @Headers('Idempotency-Key') idempotencyKey: string,
  ) {
    this.logger.log('Order dto: ', orderDto);
    const requestHash = createHash('sha256')
      .update(JSON.stringify(orderDto))
      .digest('hex');

    const existingOrder =
      await this.idempotencyKeyService.validateOrderIdempotencyKey(
        idempotencyKey,
        requestHash,
      );

    if (existingOrder !== null) {
      this.logger.log('existingOrder: ', existingOrder);
      return existingOrder;
    }

    const order = await this.ordersService.createOrder(orderDto);
    await this.idempotencyKeyService.createIdempotencyKey({
      idempotencyKey: idempotencyKey,
      requestHash: requestHash,
      response: order,
    });
    this.logger.log('order: ', order);
    return order;
  }
}
