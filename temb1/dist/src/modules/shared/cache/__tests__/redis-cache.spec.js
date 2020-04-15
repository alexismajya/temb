"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = __importDefault(require("redis"));
const redis_cache_1 = __importDefault(require("../redis-cache"));
const redis_client_1 = __importStar(require("../__mocks__/redis-client"));
jest.spyOn(redis_1.default, 'createClient').mockReturnValue(redis_client_1.default);
describe(redis_cache_1.default, () => {
    let cache;
    beforeAll(() => {
        cache = new redis_cache_1.default(redis_client_1.default);
    });
    afterAll(() => {
        redis_client_1.redisMockBackend.clear();
    });
    describe(redis_cache_1.default.prototype.save, () => {
        it('should save to cache', () => __awaiter(void 0, void 0, void 0, function* () {
            yield cache.save('hello', 'world', 'earth');
            const data = redis_client_1.redisMockBackend.get('hello');
            const result = JSON.parse(data);
            expect(result).toBeDefined();
            expect(result).toHaveProperty('world');
            expect(result.world).toEqual('earth');
        }));
        it('should add new field if key contains an object', () => __awaiter(void 0, void 0, void 0, function* () {
            yield cache.save('theKey', 'firstValue', 'tembea-backend');
            yield cache.save('theKey', 'secondValue', 'tembea-frontend');
            const data = redis_client_1.redisMockBackend.get('theKey');
            const result = JSON.parse(data);
            expect(result).toBeDefined();
            expect(result).toHaveProperty('firstValue');
            expect(result).toHaveProperty('secondValue');
        }));
    });
    describe(redis_cache_1.default.prototype.fetch, () => {
        it('should return object if it exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const [testKey, testValue] = ['ade', { name: 'bendel' }];
            redis_client_1.redisMockBackend.set(testKey, JSON.stringify(testValue));
            const result = yield cache.fetch(testKey);
            expect(result).toBeDefined();
            expect(result).toEqual(testValue);
        }));
        it('should capture everything already saved', () => __awaiter(void 0, void 0, void 0, function* () {
            const testKey = 'test_key';
            const firstSave = { key1: 'hello' };
            const secondSave = {
                key2: 'world',
                key3: 'tembea',
            };
            const thirdSave = {
                key4: 'Andela',
            };
            yield cache.save(testKey, 'key1', firstSave.key1);
            yield cache.saveObject(testKey, secondSave);
            yield cache.saveObject(testKey, thirdSave);
            const result = yield cache.fetch(testKey);
            expect(result).toHaveProperty('key1');
            expect(result).toHaveProperty('key2');
            expect(result).toHaveProperty('key3');
            expect(result).toHaveProperty('key4');
        }));
    });
    describe(redis_cache_1.default.prototype.saveObject, () => {
        it('should save entire object', () => __awaiter(void 0, void 0, void 0, function* () {
            const testKey = 'user';
            const testObject = { name: 'tomi', scores: [1, 2, 3] };
            yield cache.saveObject(testKey, testObject);
            const result = redis_client_1.redisMockBackend.get(testKey);
            expect(JSON.parse(result)).toEqual(testObject);
        }));
    });
    describe(redis_cache_1.default.prototype.delete, () => {
        it('should remove from cache', () => __awaiter(void 0, void 0, void 0, function* () {
            const [testKey, testValue] = ['mc', 'oluomo'];
            yield cache.saveObject(testKey, testValue);
            yield redis_client_1.redisMockBackend.get(testKey);
            yield cache.delete(testKey);
            const resultAfterDelete = redis_client_1.redisMockBackend.get(testKey);
            expect(resultAfterDelete).toBeUndefined();
        }));
    });
    describe(redis_cache_1.default.prototype.flush, () => {
        it('should clear all keys and objects in the cache', () => __awaiter(void 0, void 0, void 0, function* () {
            const testKey = 'user';
            yield cache.save(testKey, 'tomi', 'age');
            yield cache.save(testKey, 'kica', 'scores');
            const data = redis_client_1.redisMockBackend.get(testKey);
            const result = JSON.parse(data);
            expect(result).toBeDefined();
            expect(result).toHaveProperty('tomi');
            expect(result).toHaveProperty('kica');
            yield cache.flush();
            const cachedData = yield redis_client_1.redisMockBackend.get(testKey);
            expect(cachedData).toBeUndefined();
        }));
    });
});
//# sourceMappingURL=redis-cache.spec.js.map