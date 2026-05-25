import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma.service';
import { OutboxEvent } from 'src/orders/types/outbox-event.type';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersProducer implements OnModuleInit {
  private readonly logger = new Logger(OrdersProducer.name);

  constructor(
    private prisma: PrismaService,
    @Inject('KAFKA_SERVICE')
    private readonly kafka: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafka.connect();
  }

  @Cron('*/5 * * * * *')
  async publishOrderCreated() {
    const ordersCreated = await this.prisma.outbox_events.findMany({
      where: {
        aggregate_type: 'ORDER',
        processed: false,
      },
      take: 100,
    });

    if (ordersCreated.length === 0) return;

    for (const event of ordersCreated) {
      try {
        await this.publish(event);
        await this.markProcessed(event.id, true);
        this.logger.log(`Successfully published event: ${event.id}`);
      } catch (error) {
        this.logger.error(
          `Failed to publish event ${event.id}`,
          error instanceof Error ? error.stack : String(error),
        );
      }
    }
  }

  private async publish(event: OutboxEvent): Promise<any> {
    const source$ = this.kafka.emit('orders.events', {
      key: event.aggregate_id.toString(),
      value: event.payload,
      headers: {
        eventType: event.event_type,
        aggregate: event.aggregate_type,
      },
    });
    return firstValueFrom(source$);
  }

  private markProcessed(id: string, processed: boolean) {
    return this.prisma.outbox_events.update({
      where: { id },
      data: { processed },
    });
  }
}
