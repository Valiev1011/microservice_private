import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { REDIS_CLIENT, RedisClient } from './redis-client.types';
import { SetRedisDto } from './dto/create-redis.dto';

@Injectable()
export class RedisService implements OnModuleDestroy {
  public constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClient,
  ) {}

  async onModuleDestroy() {
    return this.redisClient.quit();
  }

  async set(setRedisDto: SetRedisDto) {
    const { key, value } = setRedisDto;
    return this.redisClient.set(key, value);
  }

  async get(key: string): Promise<string> {
    return this.redisClient.get(key);
  }

  async delete(key: string) {
    return this.redisClient.del(key);
  }
}
