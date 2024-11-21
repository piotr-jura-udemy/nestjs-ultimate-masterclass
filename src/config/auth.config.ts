import { registerAs } from '@nestjs/config';

export const authConfig = registerAs(
  'auth',
  (): AuthConfig => ({
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN ?? '60m',
    },
  }),
);

export interface AuthConfig {
  jwt: {
    secret?: string;
    expiresIn?: string;
  };
}
