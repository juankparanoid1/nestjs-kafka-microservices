import { Prisma } from 'src/generated/prisma/client';

export type IdempotencyKey = Prisma.idempotency_keysGetPayload<{
  select: {
    id: true;
    idempotency_key: true;
    request_hash: true;
    response: true;
  };
}>;
