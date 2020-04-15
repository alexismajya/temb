import redis from 'redis';

export const redisMockBackend = new Map();

const mockRedisClient = {
  get: (key: string, callbackFn: any) => {
    const data = redisMockBackend.get(key);
    return callbackFn(null, data);
  },
  set: (key: string, value: string, callbackFn: any) => {
    redisMockBackend.set(key, value);
    return callbackFn(undefined, true);
  },
  setex: (key: string, opt: any, value: string, callbackFn: any) => {
    redisMockBackend.set(key, value);
    return callbackFn(undefined, true);
  },
  del: (key: string, callbackFn: any) => {
    redisMockBackend.delete(key);
    return callbackFn(undefined, true);
  },
  flushall: (callbackFn: any) => {
    redisMockBackend.clear();
    return callbackFn(undefined, true);
  },
} as unknown as redis.RedisClient;

export default mockRedisClient;
