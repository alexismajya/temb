"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const dateHelpers_1 = require("../dateHelpers");
describe('dateHelpers', () => {
    const testDate = new Date(2020, 6, 22, 16, 42);
    const fallback = moment_timezone_1.default(testDate).format('ddd, MMM Do YYYY hh:mm a');
    let result;
    describe('getSlackDateTime', () => {
        it('should return date with fallback value', () => {
            result = dateHelpers_1.getSlackDateTime(testDate);
            expect(result.original).toEqual(testDate.getTime() / 1000);
            expect(result.fallback).toEqual(moment_timezone_1.default(testDate).format('ddd, MMM Do YYYY hh:mm a'));
        });
    });
    describe('getSlackDateString', () => {
        beforeAll(() => {
            result = dateHelpers_1.getSlackDateString(testDate);
        });
        it('should return expected string', () => {
            expect(result.endsWith(`${fallback}>`)).toBeTruthy();
        });
        it('should contain 2020 before at', () => {
            expect(result.indexOf('2020 at')).toBeGreaterThan(0);
        });
    });
    describe('getSlackDateTimeString', () => {
        beforeAll(() => {
            result = dateHelpers_1.getSlackDateTimeString(testDate);
        });
        it('should return expected string', () => {
            const date = moment_timezone_1.default(testDate).format('dddd, MMMM Do YYYY');
            const time = moment_timezone_1.default(testDate).format('h:mm a');
            const getDateTime = `${date} at ${time}`;
            expect(getDateTime).toBeDefined();
        });
        it('should contain 2020 before at', () => {
            expect(result.indexOf('2020 at')).toBeGreaterThan(0);
        });
    });
    describe('timeTo12hrs', () => {
        it('should return a valid date in am or pm', () => {
            expect(dateHelpers_1.timeTo12hrs('03:00')).toEqual('03:00 AM');
            expect(dateHelpers_1.timeTo12hrs('13:00')).toEqual('01:00 PM');
        });
    });
});
//# sourceMappingURL=dateHelpers.spec.js.map