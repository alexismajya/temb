import LRUCacheService from '../lru-cache.service';
import LRU from 'lru-cache';

const mockLRUCacheService = new LRUCacheService(new LRU());

export default mockLRUCacheService;
