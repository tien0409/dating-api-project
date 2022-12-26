import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { TransformResponseInterceptor } from './interceptors/transform-response.interceptor';
import { GatewayAdapter } from './modules/gateway/gateway.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const adapter = new GatewayAdapter(app);
  app.useWebSocketAdapter(adapter);
  app.enableCors({
    origin: [process.env.CLIENT_URL, process.env.ADMIN_CLIENT_URL],
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new TransformResponseInterceptor());
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT);
}

bootstrap();
