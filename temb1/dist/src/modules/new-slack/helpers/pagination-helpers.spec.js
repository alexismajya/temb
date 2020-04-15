"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pagination_helpers_1 = __importDefault(require("./pagination-helpers"));
const pagination_1 = require("./__mocks__/pagination");
describe(pagination_helpers_1.default, () => {
    describe(pagination_helpers_1.default.getPageNumber, () => {
        it('should get page number ', () => {
            const message = pagination_helpers_1.default.getPageNumber(pagination_1.payload);
            expect(message).toBeDefined();
        });
    });
    describe(pagination_helpers_1.default.addPaginationButtons, () => {
        it('should add pagination buttons ', () => {
            const message = pagination_helpers_1.default.addPaginationButtons(pagination_1.routes, 'availableRoutes', 'user_trip_page', 'user_route_pagination', 'user_trip_skipPage');
            expect(message).toBeDefined();
        });
    });
    describe(pagination_helpers_1.default.createPaginationBlock, () => {
        it('should create pagination block ', () => {
            const pageOne = pagination_helpers_1.default.createPaginationBlock('user_trip_pagination', 'upcomingTrips', 1, 2, 'user_trip_page', 'user_trip_skipPage');
            expect(pageOne).toBeDefined();
            const pageTwo = pagination_helpers_1.default.createPaginationBlock('user_trip_pagination', 'upcomingTrips', 2, 2, 'user_trip_page', 'user_trip_skipPage');
            expect(pageTwo).toBeDefined();
            const pageThree = pagination_helpers_1.default.createPaginationBlock('user_trip_pagination', 'upcomingTrips', 3, 5, 'user_trip_page', 'user_trip_skipPage');
            expect(pageThree).toBeDefined();
        });
    });
});
//# sourceMappingURL=pagination-helpers.spec.js.map