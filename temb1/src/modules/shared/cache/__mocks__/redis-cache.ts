import RedisCache from '../redis-cache';
import mockRedisClient from './redis-client';

const mockRedisCache = new RedisCache(mockRedisClient);

export default mockRedisCache;
