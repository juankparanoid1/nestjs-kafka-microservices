import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { OrdersController } from './orders/orders.controller';
import { OrdersService } from './orders/orders.service';
import { OrdersRepository } from './orders/repositories/orders.repository/orders.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { OrdersProducer } from './orders/events/producer/orders.producer';
import { OrdersConsumer } from './orders/events/consumer/orders.consumer';
import { IdempotencyKeyService } from './idempotency-key/idempotency-key.service';
import { IdempotencyKeyRepository } from './idempotency-key/repository/idempotency-key.repository';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'orders-service',
            brokers: ['localhost:9094'],
          },
          consumer: {
            groupId: 'orders-group',
          },
          subscribe: {
            fromBeginning: true,
          },
        },
      },
    ]),
    ScheduleModule.forRoot({}),
  ],
  controllers: [AppController, OrdersController],
  providers: [
    AppService,
    IdempotencyKeyRepository,
    IdempotencyKeyService,
    OrdersConsumer,
    OrdersProducer,
    OrdersRepository,
    OrdersService,
    PrismaService,
  ],
})
export class AppModule {}
