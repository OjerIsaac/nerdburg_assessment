import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { TransformInterceptor } from './interceptors';
import { HttpExceptionFilter } from './filters';
import { ValidationPipe } from './pipes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('NestApplication');

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.setGlobalPrefix('/api');

  const configService = app.get(ConfigService);

  const port = configService.get('PORT');

  await app.listen(port);
  logger.log(`Nerdburg backend service is running on: ${await app.getUrl()}`);
}

bootstrap();
