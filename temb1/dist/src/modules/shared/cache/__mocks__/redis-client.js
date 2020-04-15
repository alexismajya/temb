"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisMockBackend = new Map();
const mockRedisClient = {
    get: (key, callbackFn) => {
        const data = exports.redisMockBackend.get(key);
        return callbackFn(null, data);
    },
    set: (key, value, callbackFn) => {
        exports.redisMockBackend.set(key, value);
        return callbackFn(undefined, true);
    },
    setex: (key, opt, value, callbackFn) => {
        exports.redisMockBackend.set(key, value);
        return callbackFn(undefined, true);
    },
    del: (key, callbackFn) => {
        exports.redisMockBackend.delete(key);
        return callbackFn(undefined, true);
    },
    flushall: (callbackFn) => {
        exports.redisMockBackend.clear();
        return callbackFn(undefined, true);
    },
};
exports.default = mockRedisClient;
//# sourceMappingURL=redis-client.js.map