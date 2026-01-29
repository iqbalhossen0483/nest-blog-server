import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Configaration } from './configaration';
import { validate } from './env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [Configaration],
      validate: validate,
      validationOptions: {
        abortEarly: true,
        allowUnknown: false,
      },
    }),
  ],
})
export class AppConfigModule {}
