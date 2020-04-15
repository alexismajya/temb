"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const locationsMapHelpers_1 = __importDefault(require("../locationsMapHelpers"));
describe('locationPrompt', () => {
    let respond;
    beforeEach(() => {
        respond = jest.fn();
    });
    afterEach(() => {
        jest.resetAllMocks();
    });
    const locationData = {
        address: 'Nairobi', latitude: '1234567', longitude: '34567890'
    };
    const payload = {
        user: {
            id: '1'
        }
    };
    it('should call locationPrompt', () => {
        locationsMapHelpers_1.default.locationPrompt = jest.fn().mockResolvedValue({});
        locationsMapHelpers_1.default.sendResponse('pickupBtn', locationData, respond, payload);
        expect(locationsMapHelpers_1.default.locationPrompt).toBeCalled();
        locationsMapHelpers_1.default.sendResponse('destinationBtn', locationData, respond, payload);
        expect(locationsMapHelpers_1.default.locationPrompt).toBeCalled();
    });
});
//# sourceMappingURL=locatest.spec.js.map