"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utilities_1 = require("../utilities");
const environment_1 = __importDefault(require("../../../config/environment"));
describe(utilities_1.Utilities, () => {
    let utilities;
    beforeAll(() => {
        utilities = new utilities_1.Utilities(environment_1.default);
    });
    it('should create an instance', () => {
        expect(utilities).toBeDefined();
    });
    describe(utilities_1.Utilities.prototype.toSentenceCase, () => {
        it('should crate an instance', () => {
            const testParams = {
                args: 'mubarak imam',
                result: 'Mubarak imam',
            };
            expect(utilities.toSentenceCase(testParams.args))
                .toEqual(testParams.result);
        });
    });
    describe(utilities_1.Utilities.prototype.formatDate, () => {
        it('should format input date', () => {
            const testDate = new Date(1991, 11, 18);
            const testParams = {
                args: testDate.toISOString(),
                result: 'Wed',
            };
            expect(utilities.formatDate(testParams.args))
                .toEqual(expect.stringContaining(testParams.result));
        });
    });
    describe(utilities_1.Utilities.prototype.getPreviousMonth, () => {
        it('should return previous month', () => {
            const lastMonth = moment_1.default().subtract(1, 'month').format('MMM, YYYY');
            const result = utilities.getPreviousMonth();
            expect(result).toBe(lastMonth);
        });
    });
    describe(utilities_1.Utilities.prototype.nextAlphabet, () => {
        it('should return next alphabetic character', () => {
            expect(utilities.nextAlphabet('C')).toEqual('D');
        });
    });
    describe(utilities_1.Utilities.prototype.removeHoursFromDate, () => {
        it('should remove hours from data', () => {
            const testParams = {
                args: moment_1.default(new Date(1992, 12, 11, 23, 54), 'DD/MM/YYYY HH:mm'),
                expected: moment_1.default(new Date(1992, 12, 11, 21, 54)).format('DD/MM/YYYY HH:mm'),
            };
            const result = utilities.removeHoursFromDate(2, testParams.args);
            expect(result).toEqual(testParams.expected);
        });
    });
    describe(utilities_1.Utilities.prototype.getNameFromEmail, () => {
        it('should coin name from email', () => {
            const testParams = {
                args: 'mubarak.imam@andela.com',
                expected: 'Mubarak Imam',
            };
            expect(utilities.getNameFromEmail(testParams.args)).toEqual(testParams.expected);
        });
    });
    describe(utilities_1.Utilities.prototype.formatWorkHours, () => {
        it('should get workhours from and to from string', () => {
            const testParam = {
                args: '12:00 - 19:23',
                result: { from: '12:00 PM', to: '7:23 PM' },
            };
            expect(utilities.formatWorkHours(testParam.args)).toEqual(testParam.result);
        });
    });
    describe(utilities_1.Utilities.prototype.generateToken, () => {
        it('should generate token', () => {
            const testPayload = { name: 'tester' };
            const token = utilities.generateToken('30mins', testPayload);
            expect(token.split('.').length).toEqual(3);
        });
    });
    describe(utilities_1.Utilities.prototype.verifyToken, () => {
        it('should validate token', () => {
            const testSecret = environment_1.default.TEMBEA_PRIVATE_KEY;
            const testPayload = { name: 'hello' };
            const testToken = jsonwebtoken_1.default.sign(testPayload, testSecret, {
                algorithm: 'RS256',
            });
            const result = utilities.verifyToken(testToken, 'TEMBEA_PUBLIC_KEY');
            expect(result).toEqual(expect.objectContaining(testPayload));
        });
    });
    describe(utilities_1.Utilities.prototype.mapThroughArrayOfObjectsByKey, () => {
        it('should extract specified prop', () => {
            const testArray = [{ name: 'Mubarak', id: 1 }, { name: 'Imam', id: 2 }];
            const result = utilities.mapThroughArrayOfObjectsByKey(testArray, 'id');
            expect(result.length).toEqual(2);
            expect(result[1]).toEqual(2);
        });
    });
    describe(utilities_1.Utilities.prototype.getLastWeekStartDate, () => {
        it('should return previous month', () => {
            const lastWeekDate = moment_1.default().subtract(1, 'weeks').startOf('isoWeek').format('LLL');
            const result = utilities.getLastWeekStartDate('LLL');
            expect(result).toBe(lastWeekDate);
        });
    });
    describe(utilities_1.Utilities.prototype.getPreviousMonthsDate, () => {
        it('should return previous month', () => {
            const date = moment_1.default(new Date()).subtract({ months: 1 }).format('YYYY-MM-DD');
            const result = utilities.getPreviousMonthsDate(1);
            expect(result).toBe(date);
        });
    });
});
//# sourceMappingURL=utilities.spec.js.map