import { ErrorInterceptor } from '@app/common/interceptors';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ErrorInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors(
    process.env.NODE_ENV === 'development'
      ? {
          origin: '*',
          methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
          allowedHeaders: 'Content-Type, Accept, Authorization',
        }
      : {
          origin: ['http://localhost:3000'],
          methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
          allowedHeaders: 'Content-Type, Accept, Authorization',
          credentials: true,
        },
  );

  await app.listen(3000);
}
bootstrap();
