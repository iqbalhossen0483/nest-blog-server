import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { Configaration, NODE_ENV } from './config/configaration';

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
  app.use(cookieParser());
  app.useLogger([
    Configaration.nodeEnv === NODE_ENV.DEVELOPMENT ? 'error' : 'log',
    'debug',
    'error',
    'warn',
    'verbose',
  ]);

  await app.listen(Configaration.port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap().catch((err) => console.log(err));
