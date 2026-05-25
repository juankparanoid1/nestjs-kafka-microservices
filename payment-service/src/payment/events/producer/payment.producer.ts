import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Cron } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';
import { OutboxEvent } from 'src/payment/types/outbox-event.type';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PaymentProducer implements OnModuleInit {
  private readonly logger = new Logger(PaymentProducer.name);
  constructor(
    private prisma: PrismaService,
    @Inject('KAFKA_SERVICE')
    private readonly kafka: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafka.connect();
  }

  @Cron('*/5 * * * * *')
  async publishOrderPayment() {
    const ordersCreated = await this.prisma.outboxEvents.findMany({
      where: {
        aggregateType: 'PAYMENT',
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
    const source$ = this.kafka.emit('payment.events', {
      key: event.aggregateId,
      value: event.payload,
      headers: {
        eventType: event.eventType,
        aggregate: event.aggregateType,
      },
    });
    return firstValueFrom(source$);
  }

  private markProcessed(id: string, processed: boolean) {
    return this.prisma.outboxEvents.update({
      where: { id },
      data: { processed },
    });
  }
}
