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
const moment_1 = __importDefault(require("moment"));
const Validators_1 = __importDefault(require("../../../helpers/slack/UserInputValidator/Validators"));
const schemas_1 = require("./schemas");
describe('schemas', () => {
    describe(schemas_1.getTripPickupSchema, () => {
        const testPickup = () => {
            const [pickup, othersPickup] = ['Nairobi', null];
            const testData = { pickup, othersPickup };
            return {
                data: testData,
                result: Validators_1.default.validateSubmission(testData, schemas_1.getTripPickupSchema('Africa/Lagos'))
            };
        };
        it('validate pickup details', () => __awaiter(void 0, void 0, void 0, function* () {
            const { data, result } = testPickup({ pickup: 'Epic', othersPickup: null });
            expect(result.pickup).toEqual(data.pickup);
            expect(result.othersPickup).toEqual(data.othersPickup);
        }));
    });
    describe(schemas_1.getDateAndTimeSchema, () => {
        const testDateTime = (allowance) => {
            const fullDateTime = moment_1.default().add(allowance.min, 'minutes')
                .add(allowance.day, 'days').tz('Africa/Lagos');
            const [date, time] = [fullDateTime.format('YYYY-MM-DD'), fullDateTime.format('HH:mm')];
            const testData = { date, time };
            return {
                data: testData,
                result: Validators_1.default.validateSubmission(testData, schemas_1.getDateAndTimeSchema('Africa/Lagos')),
            };
        };
        it('should validate date and time', () => {
            const { data, result } = testDateTime({ day: 0, min: 60 });
            expect(result.date).toEqual(data.date);
            expect(result.time).toEqual(data.time);
        });
        it('should throw error for time in the past or less than 30mins away', () => {
            expect(() => testDateTime({ day: 0, min: 10 })).toThrow('validation failed');
        });
    });
});
//# sourceMappingURL=schemas.spec.js.map