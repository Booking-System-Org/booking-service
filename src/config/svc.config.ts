import { registerAs } from '@nestjs/config';
import { AppConfig } from './types';

export default registerAs(
  'service',
  (): AppConfig => ({
    appEnv: process.env.NODE_ENV || 'development',
  }),
);
