import redis from 'redis';
import RedisCache from '../redis-cache';
import mockRedisClient, { redisMockBackend } from '../__mocks__/redis-client';

jest.spyOn(redis, 'createClient').mockReturnValue(mockRedisClient);

describe(RedisCache, () => {
  let cache: RedisCache;

  beforeAll(() => {
    cache = new RedisCache(mockRedisClient);
  });

  afterAll(() => {
    redisMockBackend.clear();
  });

  describe(RedisCache.prototype.save, () => {
    it('should save to cache', async () => {
      await cache.save('hello', 'world', 'earth');

      const data = redisMockBackend.get('hello');
      const result = JSON.parse(data);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('world');
      expect(result.world).toEqual('earth');
    });

    it('should add new field if key contains an object', async () => {
      await cache.save('theKey', 'firstValue', 'tembea-backend');
      await cache.save('theKey', 'secondValue', 'tembea-frontend');

      const data = redisMockBackend.get('theKey');
      const result = JSON.parse(data);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('firstValue');
      expect(result).toHaveProperty('secondValue');
    });
  });

  describe(RedisCache.prototype.fetch, () => {
    it('should return object if it exists', async () => {
      const [testKey, testValue] = ['ade', { name: 'bendel' }];

      redisMockBackend.set(testKey, JSON.stringify(testValue));
      const result = await cache.fetch(testKey);
      expect(result).toBeDefined();
      expect(result).toEqual(testValue);
    });

    it('should capture everything already saved', async () => {
      const testKey = 'test_key';
      const firstSave = { key1: 'hello' };
      const secondSave = {
        key2: 'world',
        key3: 'tembea',
      };
      const thirdSave = {
        key4: 'Andela',
      };

      await cache.save(testKey, 'key1', firstSave.key1);
      await cache.saveObject(testKey, secondSave);
      await cache.saveObject(testKey, thirdSave);

      const result = await cache.fetch(testKey);

      expect(result).toHaveProperty('key1');
      expect(result).toHaveProperty('key2');
      expect(result).toHaveProperty('key3');
      expect(result).toHaveProperty('key4');
    });
  });

  describe(RedisCache.prototype.saveObject, () => {
    it('should save entire object', async () => {
      const testKey = 'user';
      const testObject = { name: 'tomi', scores: [1, 2, 3] };

      await cache.saveObject(testKey, testObject);

      const result = redisMockBackend.get(testKey);
      expect(JSON.parse(result)).toEqual(testObject);
    });
  });

  describe(RedisCache.prototype.delete, () => {
    it('should remove from cache', async () => {
      const [testKey, testValue] = ['mc', 'oluomo'];
      await cache.saveObject(testKey, testValue);

      await redisMockBackend.get(testKey);

      await cache.delete(testKey);
      const resultAfterDelete = redisMockBackend.get(testKey);
      expect(resultAfterDelete).toBeUndefined();
    });
  });

  describe(RedisCache.prototype.flush, () => {
    it('should clear all keys and objects in the cache', async () => {
      const testKey = 'user';
      await cache.save(testKey, 'tomi', 'age');
      await cache.save(testKey, 'kica', 'scores');

      const data = redisMockBackend.get(testKey);
      const result = JSON.parse(data);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('tomi');
      expect(result).toHaveProperty('kica');

      await cache.flush();
      const cachedData = await redisMockBackend.get(testKey);
      expect(cachedData).toBeUndefined();
    });
  });
});
