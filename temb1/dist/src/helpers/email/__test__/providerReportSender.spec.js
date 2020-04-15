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
const providerReportSender_1 = require("../providerReportSender");
const bugsnagHelper_1 = __importDefault(require("../../bugsnagHelper"));
const providerMonthlyReport_1 = __importDefault(require("../../../modules/report/providerMonthlyReport"));
const providerReportMock_1 = require("../__mocks__/providerReportMock");
describe('Provider Monthly Sender', () => {
    const providerReportSender = new providerReportSender_1.ProviderReportSender({
        sendMail: jest.fn(),
        client: jest.fn(() => { }),
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe('send', () => {
        it('should send mail to expected recipients', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(providerMonthlyReport_1.default, 'generateData')
                .mockImplementation(() => (new Promise((resolve) => resolve(Object.assign(Object.assign({}, providerReportMock_1.finalData2), providerReportMock_1.finalData1)))));
            jest.spyOn(providerReportSender, 'sendMail').mockResolvedValue(true);
            yield providerReportSender.sendEamilReport();
            expect(providerReportSender.sendMail).toHaveBeenCalled();
        }));
        it('should send mail to expected recipients', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(providerMonthlyReport_1.default, 'generateData')
                .mockImplementation(() => (new Promise((resolve) => resolve({}))));
            jest.spyOn(providerReportSender, 'sendMail').mockResolvedValue(true);
            yield providerReportSender.sendEamilReport();
            expect(providerReportSender.sendMail).toHaveBeenCalledTimes(0);
        }));
        it('should log to bugsnag if something goes wrong', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(providerMonthlyReport_1.default, 'generateData')
                .mockImplementation(() => (new Promise((resolve) => resolve(Object.assign(Object.assign({}, providerReportMock_1.finalData2), providerReportMock_1.finalData1)))));
            const mockError = new Error('failed to send mail');
            jest.spyOn(providerReportSender, 'sendMail').mockRejectedValue(mockError);
            jest.spyOn(bugsnagHelper_1.default, 'log').mockReturnValue('');
            yield providerReportSender.sendEamilReport();
            expect(bugsnagHelper_1.default.log).toHaveBeenCalledWith(mockError);
        }));
    });
    describe('sendMail', () => {
        const OLD_ENV = process.env;
        beforeEach(() => {
            jest.resetModules();
            process.env = Object.assign({}, OLD_ENV);
        });
        afterEach(() => {
            process.env = OLD_ENV;
        });
        it('should send mail to expected people', () => __awaiter(void 0, void 0, void 0, function* () {
            yield providerReportSender.sendMail('nairobiOps@gmail.com', providerReportMock_1.finalData1['nairobiOps@gmail.com']);
            expect(providerReportSender.emailService.sendMail).toHaveBeenCalled();
        }));
        it('should log to bugsnag if something goes wrong', () => __awaiter(void 0, void 0, void 0, function* () {
            delete process.env.TEMBEA_MAIL_ADDRESS;
            jest.spyOn(bugsnagHelper_1.default, 'log');
            yield providerReportSender.sendMail('nairobiOps@gmail.com', providerReportMock_1.finalData1['nairobiOps@gmail.com']);
            expect(bugsnagHelper_1.default.log).toHaveBeenCalledWith('TEMBEA_MAIL_ADDRESS  has not been set in the .env');
        }));
    });
});
//# sourceMappingURL=providerReportSender.spec.js.map