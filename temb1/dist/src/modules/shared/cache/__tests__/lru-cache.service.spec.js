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
Object.defineProperty(exports, "__esModule", { value: true });
const lru_cache_service_1 = __importDefault(require("../lru-cache.service"));
const lru_cache_1 = __importDefault(require("lru-cache"));
describe(lru_cache_service_1.default, () => {
    let backend;
    let cache;
    beforeAll(() => {
        backend = new lru_cache_1.default({ maxAge: 0 });
        cache = new lru_cache_service_1.default(backend);
    });
    afterAll(() => {
        backend.reset();
    });
    it('should create an instance', () => {
        expect(cache).toBeDefined();
    });
    describe(lru_cache_service_1.default.prototype.save, () => {
        it('should call backing cache save method', () => __awaiter(void 0, void 0, void 0, function* () {
            yield cache.save('hello', 'world', 'earth');
            const result = backend.get('hello');
            expect(result.world).toEqual('earth');
        }));
        it('should add new field if key contains an object', () => __awaiter(void 0, void 0, void 0, function* () {
            yield cache.save('theKey', 'firstValue', 'tembea-backend');
            yield cache.save('theKey', 'secondValue', 'tembea-frontend');
            const result = backend.get('theKey');
            expect(result).toHaveProperty('firstValue');
            expect(result).toHaveProperty('secondValue');
        }));
    });
    describe(lru_cache_service_1.default.prototype.fetch, () => {
        it('should return object if it exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const [testKey, testValue] = ['ade', 'bendel'];
            backend.set(testKey, testValue);
            const result = yield cache.fetch(testKey);
            expect(result).toBeDefined();
            expect(result).toEqual(testValue);
        }));
    });
    describe(lru_cache_service_1.default.prototype.saveObject, () => {
        it('should save entire object', () => __awaiter(void 0, void 0, void 0, function* () {
            const testKey = 'user';
            const testObject = { name: 'tomi', scores: [1, 2, 3] };
            yield cache.saveObject(testKey, testObject);
            const result = backend.get(testKey);
            expect(result).toEqual(testObject);
        }));
        it('should throw an error when saving failed', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(backend, 'set').mockImplementationOnce(() => { throw new Error(); });
            expect(cache.saveObject('hello', { key: 'value' }))
                .rejects.toThrowError();
        }));
    });
    describe(lru_cache_service_1.default.prototype.delete, () => {
        it('should remove from cache', () => __awaiter(void 0, void 0, void 0, function* () {
            const [testKey, testValue] = ['mc', { name: 'oluomo' }];
            yield cache.saveObject(testKey, testValue);
            const resultBeforeDelete = backend.get(testKey);
            expect(resultBeforeDelete).toEqual(testValue);
            yield cache.delete(testKey);
            const resultAfterDelete = backend.get(testKey);
            expect(resultAfterDelete).toBeUndefined();
        }));
        it('should throw an error when deletion failed', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(backend, 'del').mockImplementationOnce(() => { throw new Error(); });
            expect(cache.delete('key')).rejects.toThrowError();
        }));
    });
    describe(lru_cache_service_1.default.prototype.flush, () => {
        it('should flush all cached data', () => __awaiter(void 0, void 0, void 0, function* () {
            const testKey = 'user';
            yield cache.save(testKey, 'tomi', 'age');
            yield cache.save(testKey, 'kica', 'scores');
            const result = backend.get(testKey);
            expect(result).toBeDefined();
            expect(result).toHaveProperty('tomi');
            expect(result).toHaveProperty('kica');
            yield cache.flush();
            const data = backend.get(testKey);
            expect(data).toBeUndefined();
        }));
        it('should throw an error when flushing fails', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(backend, 'reset').mockImplementationOnce(() => { throw new Error(); });
            expect(cache.flush()).rejects.toThrowError();
        }));
    });
});
//# sourceMappingURL=lru-cache.service.spec.js.map