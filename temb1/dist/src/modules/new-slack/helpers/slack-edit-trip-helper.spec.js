"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const slack_edit_trip_helpers_1 = __importDefault(require("./slack-edit-trip-helpers"));
const slack_helpers_1 = __importDefault(require("./slack-helpers"));
const __mocks__1 = require("./__mocks__");
describe('EditTripHelpers', () => {
    it('should getEditRequestModal', () => {
        jest.spyOn(slack_helpers_1.default, 'getAddresses').mockResolvedValue(__mocks__1.addresses);
        slack_edit_trip_helpers_1.default.getEditRequestModal(__mocks__1.tripInfo, __mocks__1.responseUrl, __mocks__1.allDepartments, __mocks__1.homebaseName);
        expect(slack_helpers_1.default.getAddresses).toBeCalled();
    });
    it('should generateSelectedOption', () => {
        const selectedOption = slack_edit_trip_helpers_1.default.generateSelectedOption(__mocks__1.undefinedOption);
        expect(selectedOption).toEqual(__mocks__1.otherOption);
    });
});
//# sourceMappingURL=slack-edit-trip-helper.spec.js.map