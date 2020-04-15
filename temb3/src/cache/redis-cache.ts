import Redis from 'ioredis';
import env from '../config/environment';

export class RedisCache {
  constructor(private readonly client: Redis.Redis) { }

  async saveObject(key: string, value: any) {
    return await this.client.set(key, JSON.stringify(value));
  }

  async fetchObject<T = any>(key: string) {
    try {
      const result = await this.client.get(key);
      return JSON.parse(result) as T;
    } catch (_) {
      return null;
    }
  }
}

export const redisClient = new Redis(env.REDIS_URL);

const redisCache = new RedisCache(redisClient);
export default redisCache;
