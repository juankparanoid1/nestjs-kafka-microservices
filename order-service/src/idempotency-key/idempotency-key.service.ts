import { Injectable, Logger } from '@nestjs/common';
import { IdempotencyKeyRepository } from './repository/idempotency-key.repository';
import { OrderMapper } from 'src/orders/mapper/order.mapper';
import { plainToInstance } from 'class-transformer';
import { OrderDto } from 'src/orders/dto/order.dto';
import { IdempotencyKeyMapper } from './mapper/idempotency-key.mapper';
import { IdempotencyKeyDto } from './dto/idempotency-key.dto';

@Injectable()
export class IdempotencyKeyService {
  private readonly logger = new Logger(IdempotencyKeyService.name);
  constructor(private idempotencyKeyRepository: IdempotencyKeyRepository) {}

  async validateOrderIdempotencyKey(
    idempotencyKey: string,
    requestHash: string,
  ): Promise<OrderDto | null> {
    const order =
      await this.idempotencyKeyRepository.findByIdempotencyKey(idempotencyKey);
    if (!order) return null;
    if (order.request_hash !== requestHash) {
      throw new Error('Idempotency key reused with different payload');
    }

    const orderTyped = plainToInstance(OrderDto, order.response);

    return OrderMapper.toDto(orderTyped);
  }

  async createIdempotencyKey(
    data: IdempotencyKeyDto,
  ): Promise<IdempotencyKeyDto> {
    const idempotencyKey = await this.idempotencyKeyRepository.create(
      IdempotencyKeyMapper.toPersistance(data),
    );
    return IdempotencyKeyMapper.toDto(idempotencyKey);
  }

  async cleanIdempotencyKeys() {
    const expiration = new Date();
    expiration.setDate(expiration.getDate() - 7);
    this.logger.log(
      'Expiration date: ',
      expiration,
      ' curent date: ',
      Date.now(),
    );
    const deleted =
      await this.idempotencyKeyRepository.deleteExpiredKeys(expiration);
    this.logger.log('Deleted ', deleted.count, ' expired idempotency keys');
  }
}
