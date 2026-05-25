import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { PaymentProducer } from './events/producer/payment.producer';
import { PaymentConsumer } from './events/consumer/payment.consumer';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'payment-service',
            brokers: ['localhost:9094'],
          },
          consumer: {
            groupId: 'payment-group',
          },
          subscribe: {
            fromBeginning: true,
          },
        },
      },
    ]),
    ScheduleModule.forRoot({}),
  ],
  controllers: [PaymentConsumer],
  providers: [PaymentsService, PaymentProducer, PrismaService],
})
export class PaymentModule {}
