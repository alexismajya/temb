import { RedisCache } from '../redis-cache';
import { mockRedisClient } from '../../__mocks__/index';

describe('RedisCache', () => {
  let redisCache: RedisCache;
  const fakeClient = mockRedisClient;

  beforeAll(() => {
    // create fake cient and override get and set functions
    redisCache = new RedisCache(fakeClient);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should save to cache', async (done) => {
    const setRedis = jest.spyOn(fakeClient, 'set');
    await redisCache.saveObject('key', { client: 'tembea' });
    expect(setRedis).toHaveBeenCalledTimes(1);
    done();
  });

  it('should fetch from cache', async (done) => {
    const getRedis = jest.spyOn(fakeClient, 'get');
    await redisCache.fetchObject('key');
    expect(getRedis).toHaveBeenCalledTimes(1);
    done();
  });
});
