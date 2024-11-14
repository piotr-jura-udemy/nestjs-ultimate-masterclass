import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  messagePrefix: process.env.APP_MESSAGE_PREFIX ?? 'Hello ',
}));
