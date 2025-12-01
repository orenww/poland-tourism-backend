import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  async onModuleInit() {
    const redisUrl = process.env.REDIS_URL;

    if (!redisUrl) {
      throw new Error('REDIS_URL environment variable is not set');
    }

    // Connect to Redis when app starts
    this.client = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    this.client.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });

    this.client.on('error', (err) => {
      console.error('❌ Redis connection error:', err);
    });
  }

  async onModuleDestroy() {
    // Disconnect when app closes
    await this.client.quit();
  }

  // Get data from cache
  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  // Save data to cache with expiration (in seconds)
  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await this.client.set(key, JSON.stringify(value), 'EX', ttl);
  }

  // Delete specific key
  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  // Delete multiple keys by pattern
  async deletePattern(pattern: string): Promise<void> {
    const keys = await this.client.keys(pattern);
    if (keys.length > 0) {
      await this.client.del(...keys);
    }
  }

  // Clear all cache
  async clear(): Promise<void> {
    await this.client.flushall();
  }
}
