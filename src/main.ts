import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DelayInterceptor } from './common/interceptors/delay-interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, transform: true, transformOptions: {
      enableImplicitConversion: true
    }
  }));

  app.useGlobalInterceptors(new DelayInterceptor(2000));
  await app.listen(3000);
}
bootstrap();
