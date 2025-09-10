import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LogLevel, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['kafka:9092'],
        retry: {
          initialRetryTime: 1000,
          retries: 3,
          maxRetryTime: 5000,
          factor: 2,
        },
      },
      consumer: {
        groupId: 'booking-consumer-group-server',
        allowAutoTopicCreation: true,
        sessionTimeout: 30000,
        rebalanceTimeout: 60000,
        heartbeatInterval: 5000,
      },
      producer: {
        createPartitioner: Partitioners.LegacyPartitioner,
      },
      run: {
        autoCommit: false,
      },
    },
  });

  const configService = app.get<ConfigService>(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableShutdownHooks();

  const NODE_ENV = configService.getOrThrow('service.appEnv');
  const logLevels: LogLevel[] = ['error', 'warn', 'log', 'verbose'];
  if (NODE_ENV === 'development') {
    logLevels.push('debug');
  }
  app.useLogger(logLevels);

  await app.listen();
}
bootstrap();
