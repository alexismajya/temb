"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const travel_helpers_1 = __importDefault(require("./travel-helpers"));
const __mocks__1 = require("./__mocks__");
describe('SlackTravelHelpers', () => {
    it('should generate Flight Details Modal when isEdit', (done) => {
        const modal = travel_helpers_1.default.generateFlightDetailsModal(__mocks__1.isEdit, __mocks__1.pickupSelect, __mocks__1.destinationSelect, __mocks__1.cachedFlightNumber, __mocks__1.cachedDate, __mocks__1.cachedTime, __mocks__1.cachedReason);
        expect(modal).toBeDefined();
        expect(modal).toEqual(__mocks__1.expectedViewIsEditTrue);
        done();
    });
    it('should generate Flight Details Modal when is not edit', (done) => {
        const modal = travel_helpers_1.default.generateFlightDetailsModal(__mocks__1.isEditFalse, __mocks__1.pickupSelect, __mocks__1.destinationSelect, __mocks__1.cachedFlightNumber, __mocks__1.cachedDate, __mocks__1.cachedTime, __mocks__1.cachedReason);
        expect(modal).toBeDefined();
        done();
    });
});
//# sourceMappingURL=travel-helpers.spec.js.map