"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const slackValidations_1 = require("../slackValidations");
describe('isTripRescheduleTimedOut', () => {
    it('should return true', () => {
        const now = Date.now();
        const oneHourBefore = new Date(now - 60 * 60 * 1000);
        expect(slackValidations_1.isTripRescheduleTimedOut({
            departureTime: `${oneHourBefore.toISOString()}`
        })).toEqual(true);
    });
    it('should return true', () => {
        const now = Date.now();
        const oneHourAfter = new Date(now + 1 + 60 * 60 * 1000);
        expect(slackValidations_1.isTripRescheduleTimedOut({
            departureTime: `${oneHourAfter.toISOString()}`
        })).toEqual(false);
    });
});
//# sourceMappingURL=slackValidations.spec.js.map