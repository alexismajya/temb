"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_cache_1 = __importDefault(require("../redis-cache"));
const redis_client_1 = __importDefault(require("./redis-client"));
const mockRedisCache = new redis_cache_1.default(redis_client_1.default);
exports.default = mockRedisCache;
//# sourceMappingURL=redis-cache.js.map