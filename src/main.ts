/* istanbul ignore file */

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './util/exception.handler';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  // app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(3000);
}

bootstrap();
