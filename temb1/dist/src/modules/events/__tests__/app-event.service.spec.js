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
const app_event_service_1 = __importDefault(require("../app-event.service"));
describe('AppEvents Service', () => {
    it('should broadcast observable', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const testPayload = { name: 'TEST_EVENT', data: 'test' };
        const testHandler = jest.fn();
        app_event_service_1.default.subscribe(testPayload.name, testHandler);
        app_event_service_1.default.broadcast(testPayload);
        yield new Promise((resolve) => setTimeout(() => {
            resolve();
        }, 2000));
        expect(testHandler).toHaveBeenCalledWith('test');
        done();
    }));
});
//# sourceMappingURL=app-event.service.spec.js.map