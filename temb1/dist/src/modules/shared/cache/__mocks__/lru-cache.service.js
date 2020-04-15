"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lru_cache_service_1 = __importDefault(require("../lru-cache.service"));
const lru_cache_1 = __importDefault(require("lru-cache"));
const mockLRUCacheService = new lru_cache_service_1.default(new lru_cache_1.default());
exports.default = mockLRUCacheService;
//# sourceMappingURL=lru-cache.service.js.map