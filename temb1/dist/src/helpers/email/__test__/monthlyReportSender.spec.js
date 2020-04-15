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
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const department_service_1 = require("../../../modules/departments/department.service");
const monthlyReportSender_1 = __importDefault(require("../monthlyReportSender"));
const teamDetails_service_1 = require("../../../modules/teamDetails/teamDetails.service");
const ReportGeneratorService_1 = __importDefault(require("../../../services/report/ReportGeneratorService"));
const index_1 = __importDefault(require("../../../utils/index"));
const bugsnagHelper_1 = __importDefault(require("../../bugsnagHelper"));
const summary = {
    percentageChange: '20.50',
    month: 'January',
    totalTrips: 100,
    totalTripsDeclined: 20,
    totalTripsCompleted: 80,
    departments: {
        tdd: {
            completed: 30,
            declined: 10,
            total: 40
        },
        success: {
            completed: 50,
            declined: 10,
            total: 60
        }
    }
};
const departmentsMock = [
    { label: 'operations', head: { email: '2324@email.com', name: 'san' } },
    { label: 'finance', head: { email: '2324@email.com', name: 'san' } },
    { label: 'tdd', head: { email: '2324@email.com', name: 'san' } }
];
const hbsMock = {
    render: (_, data) => Promise.resolve(`<h1>Hello World ${data.name}</h1>`),
    baseTemplates: 'hello'
};
const teamsMock = [
    {
        teamId: 'S123',
    },
    {
        teamId: 'S192'
    }
];
describe('MonthlyReportSender', () => {
    const testReporter = new monthlyReportSender_1.default(hbsMock);
    beforeEach(() => {
        jest.spyOn(teamDetails_service_1.teamDetailsService, 'getAllTeams').mockResolvedValue(teamsMock);
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    describe('send', () => {
        afterEach(() => {
            jest.resetAllMocks();
            jest.restoreAllMocks();
        });
        it('should send mail to expected recipients', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(testReporter, 'sendMail').mockResolvedValue(true);
            yield testReporter.send();
            expect(teamDetails_service_1.teamDetailsService.getAllTeams).toHaveBeenCalledTimes(1);
            expect(testReporter.sendMail).toHaveBeenCalledTimes(2);
        }));
        it('should log to bugsnag if something goes wrong', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockError = new Error('failed to send mail');
            jest.spyOn(testReporter, 'sendMail').mockRejectedValue(mockError);
            jest.spyOn(bugsnagHelper_1.default, 'log').mockReturnValue();
            yield testReporter.send();
            expect(bugsnagHelper_1.default.log).toHaveBeenCalledWith(mockError);
        }));
    });
    describe('sendMail', () => {
        beforeEach(() => {
            jest.spyOn(monthlyReportSender_1.default, 'getAddresses').mockResolvedValue(departmentsMock.map((department) => ({
                name: department.head.name,
                email: department.head.email,
            })));
            jest.spyOn(ReportGeneratorService_1.default, 'getOverallTripsSummary').mockResolvedValue(summary);
            jest.spyOn(monthlyReportSender_1.default, 'getEmailReportAttachment').mockResolvedValue('hello');
            jest.spyOn(index_1.default, 'writableToReadableStream').mockResolvedValue('true');
        });
        it('should send mail to expected people', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(testReporter.emailService, 'sendMail').mockImplementation();
            jest.spyOn(ReportGeneratorService_1.default, 'getOverallTripsSummary')
                .mockImplementation(() => ({ month: '', departments: '', percentageChange: 20 }));
            jest.spyOn(monthlyReportSender_1.default, 'getEmailReportAttachment').mockImplementation(() => (new Promise((resolve) => resolve(''))));
            jest.spyOn(monthlyReportSender_1.default, 'processAttachments').mockImplementation(() => (new Promise((resolve) => resolve([{}]))));
            jest.spyOn(index_1.default, 'writableToReadableStream').mockImplementation(() => [{}]);
            jest.spyOn(fs_1.default, 'unlinkSync').mockImplementation(() => ['']);
            yield testReporter.sendMail();
            expect(ReportGeneratorService_1.default.getOverallTripsSummary).toHaveBeenCalled();
            expect(monthlyReportSender_1.default.processAttachments).toHaveBeenCalled();
            expect(monthlyReportSender_1.default.processAttachments).toHaveBeenCalled();
            expect(monthlyReportSender_1.default.getEmailReportAttachment).toHaveBeenCalled();
        }));
    });
    describe('getAddresses', () => {
        beforeEach(() => {
            jest.spyOn(department_service_1.departmentService, 'getDepartmentsForSlack').mockResolvedValue(departmentsMock);
        });
        it('should return object of name and email', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield monthlyReportSender_1.default.getAddresses();
            expect(result.length).toEqual(2);
            expect(result[0]).toHaveProperty('name');
            expect(result[1]).toHaveProperty('email');
        }));
    });
    describe('getTemplate', () => {
        it('should ', () => __awaiter(void 0, void 0, void 0, function* () {
            const testToken = 'testing';
            const template = yield testReporter.getTemplate({ name: testToken });
            const include = template.includes(testToken);
            expect(include).toBeTruthy();
        }));
    });
    describe('processAttachments', () => {
        it('should processAttachments', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(fs_1.default, 'createWriteStream').mockImplementation();
            jest.spyOn(os_1.default, 'tmpdir').mockImplementation(() => '');
            jest.spyOn(index_1.default, 'writableToReadableStream')
                .mockImplementation(() => ({
                pipe: jest.fn(),
                close: jest.fn(),
                on: ((end, fn) => {
                    fn();
                })
            }));
            const attachments = [{ filename: '', content: jest.fn() }];
            monthlyReportSender_1.default.processAttachments(attachments);
            expect(index_1.default.writableToReadableStream).toBeCalled();
        }));
    });
});
//# sourceMappingURL=monthlyReportSender.spec.js.map