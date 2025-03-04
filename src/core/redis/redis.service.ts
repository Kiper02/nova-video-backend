import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService extends Redis {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    super(configService.getOrThrow<string>("REDIS_URL"))
  }
}
