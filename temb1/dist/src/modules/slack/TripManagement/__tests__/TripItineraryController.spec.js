"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TripItineraryController_1 = require("../TripItineraryController");
const slackHelpers_1 = __importDefault(require("../../../../helpers/slack/slackHelpers"));
const DialogPrompts_1 = __importDefault(require("../../SlackPrompts/DialogPrompts"));
const SlackPaginationHelper_1 = __importDefault(require("../../../../helpers/slack/SlackPaginationHelper"));
jest.mock('../../events/', () => ({
    slackEvents: jest.fn(() => ({
        raise: jest.fn(),
        handle: jest.fn()
    })),
}));
describe('TripItineraryController', () => {
    let respond;
    beforeEach(() => {
        respond = jest.fn((value) => value);
        jest.spyOn(slackHelpers_1.default, 'findOrCreateUserBySlackId')
            .mockImplementation((slackId) => Promise.resolve({
            slackId, name: 'test user'
        }));
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe('TripItineraryController  triggerPage', () => {
        it('should sendSkipPage dialog', () => {
            jest.spyOn(DialogPrompts_1.default, 'sendSkipPage').mockReturnValue();
            const payload = {
                user: { id: 'TEST123' },
                actions: [{ name: 'skipPage' }]
            };
            TripItineraryController_1.triggerPage(payload, respond);
            expect(DialogPrompts_1.default.sendSkipPage).toHaveBeenCalled();
        });
    });
    describe('TripItineraryController  getPageNumber', () => {
        beforeEach(() => jest.spyOn(SlackPaginationHelper_1.default, 'getPageNumber'));
        it('should return a number', () => {
            const payload = {
                submission: 1,
                user: { id: 'TEST123' },
                actions: [{ name: 'page_1' }]
            };
            const res = TripItineraryController_1.getPageNumber(payload);
            expect(res).toBeGreaterThanOrEqual(1);
            expect(SlackPaginationHelper_1.default.getPageNumber).toHaveBeenCalled();
        });
        it('should return a default value of one', () => {
            const payload = { actions: [{ name: 'page_1' }] };
            const res = TripItineraryController_1.getPageNumber(payload);
            expect(res).toEqual(1);
        });
    });
});
//# sourceMappingURL=TripItineraryController.spec.js.map