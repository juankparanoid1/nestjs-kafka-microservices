import { Injectable } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class IdempotencyKeyRepository {
  constructor(private prisma: PrismaService) {}

  findByIdempotencyKey(key: string) {
    return this.prisma.idempotency_keys.findFirst({
      where: {
        idempotency_key: key,
      },
    });
  }

  create(data: Prisma.idempotency_keysCreateInput) {
    return this.prisma.idempotency_keys.create({
      data,
    });
  }

  deleteExpiredKeys(expiration: Date) {
    return this.prisma.idempotency_keys.deleteMany({
      where: {
        created_at: {
          lt: expiration,
        },
      },
    });
  }
}
