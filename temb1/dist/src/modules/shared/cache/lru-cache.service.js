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
const base_cache_1 = __importDefault(require("./base.cache"));
class LRUCache extends base_cache_1.default {
    constructor(cache) {
        super();
        this.cache = cache;
    }
    getAsync(key) {
        return new Promise((resolve, reject) => {
            try {
                const result = this.cache.get(key);
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
        });
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
            const result = yield this.getAsync(key);
            return result;
        });
    }
    saveObject(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const maxCacheAge = this.minuteToSeconds(5);
            return new Promise((resolve, reject) => {
                try {
                    const current = this.cache.get(key) || {};
                    const data = this.cache.set(key, Object.assign(Object.assign({}, current), value), maxCacheAge);
                    resolve(`${data}`);
                }
                catch (err) {
                    reject(err);
                }
            });
        });
    }
    delete(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                    this.cache.del(key);
                    resolve();
                }
                catch (err) {
                    reject(err);
                }
            });
        });
    }
    flush() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                    this.cache.reset();
                    resolve();
                }
                catch (err) {
                    reject(err);
                }
            });
        });
    }
}
exports.default = LRUCache;
//# sourceMappingURL=lru-cache.service.js.map