import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { TransformResponseInterceptor } from './interceptors/transform-response.interceptor';
import { ChatAdapter } from './modules/chat/chat.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const adapter = new ChatAdapter(app);
  app.useWebSocketAdapter(adapter);
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformResponseInterceptor());
  app.setGlobalPrefix('api');
  await app.listen(3001);
}

bootstrap();
