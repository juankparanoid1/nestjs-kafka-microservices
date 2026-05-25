import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class OrdersRepository {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.ordersCreateInput) {
    return this.prisma.orders.create({
      data,
      include: {
        order_items: true,
      },
    });
  }

  createOutboxEvent(data: Prisma.outbox_eventsCreateInput) {
    return this.prisma.outbox_events.create({
      data,
    });
  }
}
