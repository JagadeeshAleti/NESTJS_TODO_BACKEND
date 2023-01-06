import { NestFactory } from '@nestjs/core';
import { config } from 'dotenv';
config();

import { AppModule } from './app.module';
import { AuthGaurd } from './gaurds/auth.gaurd';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'debug', 'error', 'verbose', 'warn'],
  });
  await app.listen(3000);
}
bootstrap();
