import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptor/logging.interceptor';
import { NODE_ENV } from './config/env.validation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') || 8080;
  const nodeEnv = config.get<string>('NODE_ENV');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: false,
    }),
  );

  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.use(cookieParser());
  app.useLogger([
    nodeEnv === NODE_ENV.DEVELOPMENT ? 'error' : 'log',
    'debug',
    'error',
    'warn',
    'verbose',
  ]);

  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap().catch((err) => console.log(err));
