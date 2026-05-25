import { Prisma } from 'src/generated/prisma/client';

export type OutboxEvent = Prisma.outbox_eventsGetPayload<{
  select: {
    id: true;
    aggregate_id: true;
    aggregate_type: true;
    event_type: true;
    payload: true;
    processed: true;
    created_at: true;
    updated_at: true;
  };
}>;
