import redis from 'redis';
import LRU from 'lru-cache';
import env from '../../../config/environment';
import RedisCache from './redis-cache';
import LRUCache from './lru-cache.service';
import BaseCache from './base.cache';

const cache: BaseCache = env.REDIS_URL.startsWith('redis')
  ? new RedisCache(redis.createClient(env.REDIS_URL))
  : new LRUCache(new LRU({ maxAge: 1000 * 60 * 15 }));

export default cache;
