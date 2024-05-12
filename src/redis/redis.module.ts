import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisClientFactory } from './redis-client-factory';

@Module({
  controllers: [],
  providers: [RedisClientFactory, RedisService],
  exports: [RedisService],
})
export class RedisModule {}
