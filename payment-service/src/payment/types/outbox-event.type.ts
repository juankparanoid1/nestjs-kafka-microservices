import { Prisma } from 'src/generated/prisma/client';

export type OutboxEvent = Prisma.OutboxEventsGetPayload<{
  select: {
    id: true;
    aggregateId: true;
    aggregateType: true;
    eventType: true;
    payload: true;
    processed: true;
    created_at: true;
    updatedAt: true;
  };
}>;
