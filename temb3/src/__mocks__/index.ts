import Redis from 'ioredis';
import { RedisCache } from '../cache/redis-cache';

const getMockRedisClient = () => {
  const store = new Map<string, string>();
  return {
    set: async (key: string, value: any) => Promise.resolve(store.set(key, value)),
    get: async (key: string) => Promise.resolve(store.get(key)),
  };
};

export const mockRedisClient = Object.assign(new Redis(), getMockRedisClient());
export const mockRedisCache = new RedisCache(mockRedisClient);
export const bullRedisMock = {
  createClient(type?: string): Redis.Redis {
    switch (type) {
      case 'client':
      case 'subscriber':
      default:
        return mockRedisClient;
    }
  },
};
