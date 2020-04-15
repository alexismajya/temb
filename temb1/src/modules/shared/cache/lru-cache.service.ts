import { default as LRU } from 'lru-cache';
import BaseCache from './base.cache';

class LRUCache extends BaseCache {
  private readonly cache: LRU<string, any>;
  constructor(cache: LRU<string, any>) {
    super();
    this.cache = cache;
  }

  private getAsync<T = any>(key: string) {
    return new Promise<T>((resolve, reject) => {
      try {
        const result = this.cache.get(key) as T;
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  async save<T = any>(key: string, field: string, value: T) {
    const currentState = await this.fetch(key) || {};
    currentState[field] = value;
    return this.saveObject(key, currentState);
  }

  async fetch<T = any>(key: string) {
    const result = await this.getAsync<T>(key);
    return result as T;
  }

  async saveObject<T = any>(key: string, value: T) {
    const maxCacheAge = this.minuteToSeconds(5);
    return new Promise<string>((resolve, reject) => {
      try {
        const current = this.cache.get(key) || {};
        const data = this.cache.set(key, { ...current, ...value }, maxCacheAge);
        resolve(`${data}`);
      } catch (err) {
        reject(err);
      }
    });
  }

  async delete(key: string) {
    return new Promise<number>((resolve, reject) => {
      try {
        this.cache.del(key);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  async flush() {
    return new Promise<void>((resolve, reject) => {
      try {
        this.cache.reset();
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }
}

export default LRUCache;
