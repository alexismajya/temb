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
const util_1 = require("util");
const base_cache_1 = __importDefault(require("./base.cache"));
class RedisCache extends base_cache_1.default {
    constructor(redisClient, maxCacheAge = 15000) {
        super();
        this.maxCacheAge = maxCacheAge;
        this.client = redisClient;
        this.promisifiedClient = {
            getAsync: util_1.promisify(this.client.get).bind(this.client),
            setAsync: util_1.promisify(this.client.set).bind(this.client),
            setexAsync: util_1.promisify(this.client.setex).bind(this.client),
            delAsync: util_1.promisify(this.client.del).bind(this.client),
            flushallAsync: util_1.promisify(this.client.flushall).bind(this.client),
        };
    }
    save(key, field, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentState = (yield this.fetch(key)) || {};
            currentState[field] = value;
            return this.saveObject(key, currentState);
        });
    }
    fetch(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.promisifiedClient.getAsync(key);
            return (result ? JSON.parse(result) : result);
        });
    }
    saveObject(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const current = (yield this.fetch(key)) || {};
            return this.promisifiedClient.setexAsync(key, this.maxCacheAge, JSON.stringify(Object.assign(Object.assign({}, current), value)));
        });
    }
    delete(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.promisifiedClient.delAsync(key);
        });
    }
    flush() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.promisifiedClient.flushallAsync();
        });
    }
}
exports.default = RedisCache;
//# sourceMappingURL=redis-cache.js.map