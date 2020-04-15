"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = __importDefault(require("redis"));
const lru_cache_1 = __importDefault(require("lru-cache"));
const environment_1 = __importDefault(require("../../../config/environment"));
const redis_cache_1 = __importDefault(require("./redis-cache"));
const lru_cache_service_1 = __importDefault(require("./lru-cache.service"));
const cache = environment_1.default.REDIS_URL.startsWith('redis')
    ? new redis_cache_1.default(redis_1.default.createClient(environment_1.default.REDIS_URL))
    : new lru_cache_service_1.default(new lru_cache_1.default({ maxAge: 1000 * 60 * 15 }));
exports.default = cache;
//# sourceMappingURL=index.js.map