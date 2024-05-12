import { FactoryProvider } from '@nestjs/common';
import { createClient } from 'redis';
import { REDIS_CLIENT, RedisClient } from './redis-client.types';

export const RedisClientFactory: FactoryProvider<Promise<RedisClient>> = {
  provide: REDIS_CLIENT,
  useFactory: async () => {
    const client = createClient({
      url: process.env.REDIS_URL,
    });
    await client.connect();
    return client;
  },
};
