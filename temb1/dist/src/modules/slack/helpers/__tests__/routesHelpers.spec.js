"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routesHelper_1 = __importDefault(require("../routesHelper"));
const routeDummyData_1 = __importDefault(require("./routeDummyData"));
const SlackPaginationHelper_1 = __importDefault(require("../../../../helpers/slack/SlackPaginationHelper"));
const { items, totalPages, currentPage } = routeDummyData_1.default;
describe('RoutesHelpers', () => {
    describe('RoutesHelpers__createRouteAttachment', () => {
        it('should formant all available routes', () => {
            const result = routesHelper_1.default.createRouteAttachment(items);
            expect(result).toHaveProperty('fields');
        });
    });
    describe('RoutesHelpers__toAvailableRoutesAttachment', () => {
        beforeEach(() => {
            jest.spyOn(SlackPaginationHelper_1.default, 'createPaginationAttachment');
        });
        it('should display a message when there are is no available routes', () => {
            const res = routesHelper_1.default.toAvailableRoutesAttachment([], 2, 5);
            const { attachments: [SlackInteractiveMessage] } = res;
            expect(SlackInteractiveMessage.text).toEqual('Sorry, route not available at the moment :disappointed:');
        });
        it('should render attachment if their is available route with pagination attachment', () => {
            const res = routesHelper_1.default.toAvailableRoutesAttachment(items, totalPages, currentPage);
            expect(SlackPaginationHelper_1.default.createPaginationAttachment).toBeCalled();
            expect(res.text).toEqual('*All Available Routes:slightly_smiling_face:*');
        });
    });
});
//# sourceMappingURL=routesHelpers.spec.js.map