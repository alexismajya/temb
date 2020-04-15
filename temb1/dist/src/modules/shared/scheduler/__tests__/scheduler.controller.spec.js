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
const scheduler_controller_1 = __importDefault(require("../scheduler.controller"));
const scheduler_service_1 = __importDefault(require("../__mocks__/scheduler.service"));
describe(scheduler_controller_1.default, () => {
    let controller;
    beforeAll(() => {
        controller = new scheduler_controller_1.default(scheduler_service_1.default);
    });
    it('should instantiate a scheduler controller', () => {
        expect(controller).toBeDefined();
    });
    describe(scheduler_controller_1.default.prototype.handle, () => {
        it('should call schedulerService.handle', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(scheduler_service_1.default, 'handleJob').mockResolvedValue(null);
            const testArgs = {
                req: {},
                res: {
                    send: jest.fn(),
                },
            };
            yield controller.handle(testArgs.req, testArgs.res);
        }));
    });
});
//# sourceMappingURL=scheduler.controller.spec.js.map