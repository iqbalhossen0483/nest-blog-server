import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config, NODE_ENV } from './config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: false,
    }),
  );

  app.setGlobalPrefix('api');
  app.useLogger([
    config.nodeEnv === NODE_ENV.DEVELOPMENT ? 'error' : 'log',
    'debug',
    'error',
    'warn',
    'verbose',
  ]);

  await app.listen(config.port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap().catch((err) => console.log(err));
