import { NODE_ENV } from './env.validation';
export const Configaration = () => ({
  port: parseInt(process.env.PORT as string) || 8080,
  nodeEnv: (process.env.NODE_ENV as NODE_ENV) || NODE_ENV.DEVELOPMENT,
  jwtSecret: process.env.JWT_SECRET || 'secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
});
