import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      json: true,
      colors: true,
      prefix: 'orders-service',
    }),
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9094'],
        retry: {
          retries: 3, // FixedBackOff maximum attempts
          initialRetryTime: 2000, // 2000L (2 seconds)
          factor: 1, // 1 means linear retry (always 2s), not exponential
        },
      },
      consumer: {
        groupId: 'orders-group', // Your actual consuming group
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
