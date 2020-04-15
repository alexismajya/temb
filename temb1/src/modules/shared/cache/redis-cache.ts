import Redis from 'redis';
import { promisify } from 'util';
import BaseCache from './base.cache';

class RedisCache extends BaseCache {
  private readonly client: Redis.RedisClient;
  private promisifiedClient: {
    setAsync?: (key: string, value: string) => Promise<string>;
    getAsync: (key: string) => Promise<string>;
    setexAsync: (key: string, seconds: number, value: string) => Promise<string>;
    delAsync: (key: string) => Promise<number>;
    flushallAsync: () => Promise<void>;
  };

  constructor(redisClient: Redis.RedisClient, private readonly maxCacheAge = 15000) {
    super();
    this.client = redisClient;
    this.promisifiedClient = {
      getAsync: promisify(this.client.get).bind(this.client),
      setAsync: promisify(this.client.set).bind(this.client),
      setexAsync: promisify(this.client.setex).bind(this.client),
      delAsync: promisify(this.client.del).bind(this.client),
      flushallAsync: promisify(this.client.flushall).bind(this.client),
    };
  }

  async save<T = any>(key: string, field: string, value: T) {
    const currentState = await this.fetch(key) || {};
    currentState[field] = value;
    return this.saveObject(key, currentState);
  }

  async fetch<T = any>(key: string) {
    const result = await this.promisifiedClient.getAsync(key);
    return (result ? JSON.parse(result) : result) as T;
  }

  async saveObject<T = any>(key: string, value: T) {
    const current = await this.fetch<T>(key) || {};
    return this.promisifiedClient.setexAsync(key, this.maxCacheAge,
      JSON.stringify({ ...current, ...value }));
  }

  async delete(key: string) {
    return this.promisifiedClient.delAsync(key);
  }

  async flush() {
    return this.promisifiedClient.flushallAsync();
  }
}

export default RedisCache;
