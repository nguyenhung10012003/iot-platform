import { ErrorInterceptor } from '@app/common/interceptors';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ErrorInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      // forbidNonWhitelisted: true,
    }),
  );
  app.enableCors(
    process.env.NODE_ENV === 'development'
      ? {
          origin: ['http://localhost:3001'],
          methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
          allowedHeaders: 'Content-Type, Accept, Authorization',
          credentials: true,
        }
      : {
          origin: ['http://localhost:3001'],
          methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
          allowedHeaders: 'Content-Type, Accept, Authorization',
          credentials: true,
        },
  );

  await app.listen(3000, () => {
    Logger.log(`Environment: ${process.env.NODE_ENV}`);
  });
}
bootstrap();
