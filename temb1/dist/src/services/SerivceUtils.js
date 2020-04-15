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
const cache_1 = __importDefault(require("../modules/shared/cache"));
exports.getRequest = (id, type, getRequestByPk) => __awaiter(void 0, void 0, void 0, function* () {
    let request;
    const result = yield cache_1.default.fetch(`${type}Request_${id}`);
    const requestType = `${type.toLowerCase()}Request`;
    if (result && result[requestType]) {
        ({ [requestType]: request } = result);
    }
    else {
        request = yield getRequestByPk(id);
        yield cache_1.default.saveObject(`${type}Request_${request.id}`, { [requestType]: request });
    }
    return request;
});
exports.updateRequest = (id, data, getRequestByPk, type, route = '') => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield getRequestByPk(id);
    yield request.update(data);
    yield cache_1.default.save(`${type}Request_${request.id}`, `${type.toLowerCase()}${route}Request`, request);
    return request;
});
//# sourceMappingURL=SerivceUtils.js.map