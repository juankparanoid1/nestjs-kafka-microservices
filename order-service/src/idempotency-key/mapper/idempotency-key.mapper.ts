import { Prisma } from 'src/generated/prisma/client';
import { IdempotencyKeyDto } from '../dto/idempotency-key.dto';
import { IdempotencyKey } from '../types/idempotency-key.type';

export class IdempotencyKeyMapper {
  static toPersistance(
    dto: IdempotencyKeyDto,
  ): Prisma.idempotency_keysCreateInput {
    return {
      id: dto.id,
      idempotency_key: dto.idempotencyKey,
      request_hash: dto.requestHash,
      response: dto.response,
    };
  }

  static toDto(entity: IdempotencyKey): IdempotencyKeyDto {
    return {
      id: entity.id,
      idempotencyKey: entity.idempotency_key,
      requestHash: entity.request_hash,
      response: entity.response as unknown as Record<string, any>,
    };
  }
}
