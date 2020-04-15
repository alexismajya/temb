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
const web_socket_event_service_1 = __importDefault(require("../web-socket-event.service"));
describe('websocketEvents Service', () => {
    it('should broadcast an event', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const websocketEvents = new web_socket_event_service_1.default();
        const testPayload = { name: 'TEST_EVENT', data: 'test' };
        const sockets = websocketEvents.broadcast(testPayload.name, testPayload.data);
        expect(sockets).toBeTruthy();
        done();
    }));
});
//# sourceMappingURL=web-socket-event.service.spec.js.map