"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WebClientSingleton_1 = __importDefault(require("../WebClientSingleton"));
describe('The WebClientSingleton Test', () => {
    it('should return the created webclient', () => {
        const web = WebClientSingleton_1.default.getWebClient('hello');
        expect(web.constructor.name).toEqual('WebClient');
    });
});
//# sourceMappingURL=webClient.spec.js.map