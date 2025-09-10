import { registerAs } from '@nestjs/config';
import { KafkaConfig } from './types';

export default registerAs(
  'kafka',
  (): KafkaConfig => ({
    clientId: process.env.KAFKA_CLIENT_ID || 'booking-service',
  }),
);
