import LRUCacheService from '../lru-cache.service';
import LRUCache from 'lru-cache';

describe(LRUCacheService, () => {
  let backend: LRUCache<string, any>;
  let cache: LRUCacheService;

  beforeAll(() => {
    backend = new LRUCache<string, any>({ maxAge: 0 });
    cache = new LRUCacheService(backend);
  });

  afterAll(() => {
    backend.reset();
  });

  it('should create an instance', () => {
    expect(cache).toBeDefined();
  });

  describe(LRUCacheService.prototype.save, () => {
    it('should call backing cache save method', async () => {
      await cache.save('hello', 'world', 'earth');

      const result = backend.get('hello');

      expect(result.world).toEqual('earth');
    });

    it('should add new field if key contains an object', async () => {
      await cache.save('theKey', 'firstValue', 'tembea-backend');
      await cache.save('theKey', 'secondValue', 'tembea-frontend');

      const result = backend.get('theKey');
      expect(result).toHaveProperty('firstValue');
      expect(result).toHaveProperty('secondValue');
    });
  });

  describe(LRUCacheService.prototype.fetch, () => {
    it('should return object if it exists', async () => {
      const [testKey, testValue] = ['ade', 'bendel'];

      backend.set(testKey, testValue);
      const result = await cache.fetch(testKey);
      expect(result).toBeDefined();
      expect(result).toEqual(testValue);
    });
  });

  describe(LRUCacheService.prototype.saveObject, () => {
    it('should save entire object', async () => {
      const testKey = 'user';
      const testObject = { name: 'tomi', scores: [1, 2, 3] };

      await cache.saveObject(testKey, testObject);

      const result = backend.get(testKey);
      expect(result).toEqual(testObject);
    });

    it('should throw an error when saving failed', async () => {
      jest.spyOn(backend, 'set').mockImplementationOnce(() => { throw new Error(); });
      expect(cache.saveObject('hello', { key: 'value' }))
        .rejects.toThrowError();
    });
  });

  describe(LRUCacheService.prototype.delete, () => {
    it('should remove from cache', async () => {
      const [testKey, testValue] = ['mc', { name: 'oluomo' }];
      await cache.saveObject(testKey, testValue);

      const resultBeforeDelete = backend.get(testKey);
      expect(resultBeforeDelete).toEqual(testValue);

      await cache.delete(testKey);
      const resultAfterDelete = backend.get(testKey);
      expect(resultAfterDelete).toBeUndefined();
    });

    it('should throw an error when deletion failed', async () => {
      jest.spyOn(backend, 'del').mockImplementationOnce(() => { throw new Error(); });
      expect(cache.delete('key')).rejects.toThrowError();
    });
  });

  describe(LRUCacheService.prototype.flush, () => {
    it('should flush all cached data', async () => {
      const testKey = 'user';
      await cache.save(testKey, 'tomi', 'age');
      await cache.save(testKey, 'kica', 'scores');

      const result = backend.get(testKey);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('tomi');
      expect(result).toHaveProperty('kica');

      await cache.flush();
      const data = backend.get(testKey);
      expect(data).toBeUndefined();
    });

    it('should throw an error when flushing fails', async () => {
      jest.spyOn(backend, 'reset').mockImplementationOnce(() => { throw new Error(); });
      expect(cache.flush()).rejects.toThrowError();
    });
  });
});
