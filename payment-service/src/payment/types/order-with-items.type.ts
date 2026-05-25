import { Prisma } from 'src/generated/prisma/client';

export type OrderWithItems = Prisma.OrdersGetPayload<{
  include: { orderItems: true };
}>;
