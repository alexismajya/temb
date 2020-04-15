"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const travel_edit_helpers_1 = __importDefault(require("./travel-edit-helpers"));
const __mocks__1 = require("./__mocks__");
describe('TravelEditHelpers', () => {
    describe('createTravelSummaryMenu', () => {
        it('should createTravelSummaryMenu Airport Transfer', (done) => {
            const modal = travel_edit_helpers_1.default.createTravelSummaryMenu(__mocks__1.tripPayloadEmpty, __mocks__1.tripTypeAirportTransfer);
            expect(modal).toBeDefined();
            done();
        });
        it('should createTravelSummaryMenu Others', (done) => {
            const modal = travel_edit_helpers_1.default.createTravelSummaryMenu(__mocks__1.tripPayload, __mocks__1.tripType);
            expect(modal).toBeDefined();
            done();
        });
    });
    describe('checkIsEditFlightDetails', () => {
        it('should checkIsEditFlightDetails when isEdit', () => {
            const check = travel_edit_helpers_1.default.checkIsEditFlightDetails(__mocks__1.tripDetails, __mocks__1.isEdit);
            expect(check).toEqual(__mocks__1.checkFlightResponse);
        });
        it('should checkIsEditFlightDetails', () => {
            const check = travel_edit_helpers_1.default.checkIsEditFlightDetails(__mocks__1.tripDetails, __mocks__1.isEditFalse);
            expect(check).toEqual(__mocks__1.checkFlightEmptyResponse);
        });
    });
    describe('checkIsEditTripDetails', () => {
        it('should checkIsEditTripDetails', () => {
            const check = travel_edit_helpers_1.default.checkIsEditTripDetails(__mocks__1.tripDetails, __mocks__1.isEditFalse);
            expect(check).toEqual(__mocks__1.checkTripEmptyResponse);
        });
        it('should checkIsEditTripDetails when isEdit', () => {
            const check = travel_edit_helpers_1.default.checkIsEditTripDetails(__mocks__1.tripDetails, __mocks__1.isEdit);
            expect(check).toEqual(__mocks__1.checkTripResponse);
        });
    });
    describe('generateSelectedOption', () => {
        it('should generateSelectedOption', () => {
            const option = travel_edit_helpers_1.default.generateSelectedOption('test');
            expect(option).toEqual(__mocks__1.generatedOption);
        });
    });
});
//# sourceMappingURL=travel-edit-helpers.spec.js.map