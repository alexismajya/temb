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
const index_1 = __importDefault(require("../index"));
describe('SlackPagination', () => {
    let payload;
    beforeEach(() => {
        payload = {
            actions: [{ name: 'page_2' }]
        };
    });
    describe('SlackPagination_createPaginationAttachment', () => {
        it('Should display the next pagination button', () => __awaiter(void 0, void 0, void 0, function* () {
            payload.actions[0].name = 'upcoming';
            const pageButtons = index_1.default.createPaginationAttachment('trip_itinerary', 'view_upcoming_trips', payload, 10, 1);
            expect(pageButtons.actions[1].text).toEqual('Next >');
        }));
        it('Should display previous, next and Skip to page button', () => __awaiter(void 0, void 0, void 0, function* () {
            const pageButtons = index_1.default.createPaginationAttachment('trip_itinerary', 'view_upcoming_trips', payload, 21, 3);
            expect(pageButtons.actions[0].text).toEqual('< Prev');
            expect(pageButtons.actions[1].text).toEqual('Next >');
            expect(pageButtons.actions[2].text).toEqual('Skip to page');
        }));
        it('Should display the previous pagination button', () => __awaiter(void 0, void 0, void 0, function* () {
            const pageButtons = index_1.default.createPaginationAttachment('trip_itinerary', 'view_upcoming_trips', payload, 1, 1);
            expect(pageButtons.actions[0].text).toEqual('< Prev');
        }));
        it('Should display both next and skip to page buttons', () => __awaiter(void 0, void 0, void 0, function* () {
            const pageButtons = index_1.default.createPaginationAttachment('trip_itinerary', 'view_upcoming_trips', 1, 1);
            expect(pageButtons.actions[0].text).toEqual('Next >');
            expect(pageButtons.actions[1].text).toEqual('Skip to page');
        }));
        it('Should display both prev and skip to page buttons', () => __awaiter(void 0, void 0, void 0, function* () {
            const pageButtons = index_1.default.createPaginationAttachment('trip_itinerary', 'view_upcoming_trips', 2, 1);
            expect(pageButtons.actions[0].text).toEqual('< Prev');
            expect(pageButtons.actions[1].text).toEqual('Skip to page');
        }));
    });
    describe('SlackPagination_getPageNumber', () => {
        it('should return the page number', () => {
            const pageNumber = index_1.default.getPageNumber('page_2');
            expect(pageNumber).toEqual(2);
        });
        it('should return the default page number', () => {
            const pageNumber = index_1.default.getPageNumber('upcoming');
            expect(pageNumber).toEqual(1);
        });
    });
    describe('SlackPagination_getSlackPageSize', () => {
        it('should return the page number', () => {
            const slackPageSize = index_1.default.getSlackPageSize();
            expect(slackPageSize).not.toBeNull();
            expect(slackPageSize).not.toBe('string');
            expect(slackPageSize).not.toBeLessThan(1);
        });
    });
});
//# sourceMappingURL=SlackPaginationHelper.spec.js.map