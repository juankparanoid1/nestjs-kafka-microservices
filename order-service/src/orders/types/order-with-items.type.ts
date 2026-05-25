import { Prisma } from 'src/generated/prisma/client';

export type OrderWithItems = Prisma.ordersGetPayload<{
  include: { order_items: true };
}>;

export type OrderCreatedEvent = OrderWithItems & {
  eventId: string;
};
