export enum NODE_ENV {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
}

interface Config {
  port: number;
  nodeEnv: NODE_ENV;
  jwtSecret: string;
}

export const config: Config = {
  port: parseInt(process.env.PORT as string) || 8080,
  nodeEnv: (process.env.NODE_ENV as NODE_ENV) || NODE_ENV.DEVELOPMENT,
  jwtSecret: process.env.JWT_SECRET || 'secret',
};
