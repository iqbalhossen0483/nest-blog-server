import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, validateSync } from 'class-validator';

export enum NODE_ENV {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
}

export class EnvValidation {
  @IsNotEmpty({ message: 'PORT should not be empty' })
  @IsNumber({ allowNaN: false }, { message: 'PORT must be a number' })
  PORT: number;

  @IsNotEmpty({ message: 'NODE_ENV should not be empty' })
  @IsEnum(NODE_ENV, {
    message: `NODE_ENV must be one of the following values: ${Object.values(NODE_ENV).join(', ')}`,
  })
  NODE_ENV: NODE_ENV;

  @IsNotEmpty({ message: 'JWT_SECRET should not be empty' })
  JWT_SECRET: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvValidation, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
