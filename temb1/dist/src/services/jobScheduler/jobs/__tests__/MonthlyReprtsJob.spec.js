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
const node_schedule_1 = __importDefault(require("node-schedule"));
const MonthlyReportsJob_1 = __importDefault(require("../MonthlyReportsJob"));
const twilio_mocks_1 = require("../../../../modules/notifications/whatsapp/twilio.mocks");
twilio_mocks_1.mockWhatsappOptions();
describe('MonthlyReprtsJob', () => {
    it('should scheduleAllMonthlyReports successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(node_schedule_1.default, 'scheduleJob').mockImplementation((start, fn) => __awaiter(void 0, void 0, void 0, function* () {
            yield Promise.resolve(fn);
        }));
        yield MonthlyReportsJob_1.default.scheduleAllMonthlyReports();
        expect(node_schedule_1.default.scheduleJob).toBeCalledTimes(1);
    }));
});
//# sourceMappingURL=MonthlyReprtsJob.spec.js.map