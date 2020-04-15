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
const seeAvailableRoute_controller_1 = __importDefault(require("../seeAvailableRoute.controller"));
const seeAvailableRoute_helpers_1 = __importDefault(require("../seeAvailableRoute.helpers"));
const homebase_service_1 = require("../../../../homebases/homebase.service");
const routeBatch_service_1 = require("../../../../routeBatches/routeBatch.service");
const user_route_mocks_1 = require("../__mocks__/user-route-mocks");
'../../../slack/RouteManagement/JoinRoute/JoinRouteNotifications';
const updatePastMessageHelper_1 = __importDefault(require("../../../../../helpers/slack/updatePastMessageHelper"));
describe(seeAvailableRoute_controller_1.default, () => {
    const { actionRespond, modalRespond, } = user_route_mocks_1.dependencyMocks;
    const where = { status: 'Active' };
    const { response_url: state } = user_route_mocks_1.payload;
    const pagedResult = {
        data: [
            { id: 59, batch: 'A', capacity: 4, routeId: 59 },
            { id: 60, batch: 'A', capacity: 4, routeId: 60 },
        ],
    };
    const url = JSON.parse(user_route_mocks_1.payload.view.private_metadata);
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    describe(seeAvailableRoute_controller_1.default.seeAvailableRoutes, () => {
        it('should get availaible routes', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(seeAvailableRoute_controller_1.default, 'getAllRoutes').mockReturnValueOnce(user_route_mocks_1.payload);
            yield seeAvailableRoute_controller_1.default.seeAvailableRoutes(user_route_mocks_1.payload, actionRespond);
            expect(seeAvailableRoute_controller_1.default.getAllRoutes).toHaveBeenCalledWith(user_route_mocks_1.payload, where);
        }));
    });
    describe(seeAvailableRoute_controller_1.default.getAllRoutes, () => {
        it('should get all routes', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(homebase_service_1.homebaseService, 'getHomeBaseBySlackId').mockReturnValueOnce(user_route_mocks_1.homebase);
            jest.spyOn(routeBatch_service_1.routeBatchService, 'getPagedAvailableRouteBatches')
                .mockReturnValueOnce(pagedResult);
            jest.spyOn(seeAvailableRoute_helpers_1.default, 'getAvailableRoutesBlockMessage')
                .mockReturnValueOnce(pagedResult);
            yield seeAvailableRoute_controller_1.default.getAllRoutes(user_route_mocks_1.payload, where);
            expect(homebase_service_1.homebaseService.getHomeBaseBySlackId).toHaveBeenCalledWith(user_route_mocks_1.payload.user.id);
            expect(routeBatch_service_1.routeBatchService.getPagedAvailableRouteBatches).toHaveBeenCalledWith(user_route_mocks_1.homebase.id, 1, where);
            expect(seeAvailableRoute_helpers_1.default.getAvailableRoutesBlockMessage).toHaveBeenCalledWith(pagedResult);
        }));
    });
    describe(seeAvailableRoute_controller_1.default.searchRoute, () => {
        it('should popup the modal for search route', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(seeAvailableRoute_helpers_1.default, 'popModalForSeachRoute').mockResolvedValue(null);
            yield seeAvailableRoute_controller_1.default.searchRoute(user_route_mocks_1.payload);
            expect(seeAvailableRoute_helpers_1.default.popModalForSeachRoute)
                .toHaveBeenCalledWith(user_route_mocks_1.payload, state);
        }));
    });
    describe(seeAvailableRoute_controller_1.default.handleSearchRoute, () => {
        it('should handle search route', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(seeAvailableRoute_controller_1.default, 'getAllRoutes').mockReturnValueOnce(user_route_mocks_1.blockMessage);
            jest.spyOn(modalRespond, 'clear');
            jest.spyOn(updatePastMessageHelper_1.default, 'sendMessage').mockReturnValueOnce(null);
            yield seeAvailableRoute_controller_1.default.handleSearchRoute(user_route_mocks_1.payload, {}, modalRespond);
            expect(seeAvailableRoute_controller_1.default.getAllRoutes).toHaveBeenCalledWith(user_route_mocks_1.payload, where);
            expect(modalRespond.clear).toHaveBeenCalledTimes(1);
            expect(updatePastMessageHelper_1.default.sendMessage).toHaveBeenCalledWith(url, user_route_mocks_1.blockMessage);
        }));
        it('should respond with error when it fails to get all routes', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(seeAvailableRoute_controller_1.default, 'getAllRoutes').mockReturnValueOnce(null);
            yield seeAvailableRoute_controller_1.default.handleSearchRoute(user_route_mocks_1.unCompletePayload, {}, modalRespond);
            expect(seeAvailableRoute_controller_1.default.getAllRoutes).toHaveBeenCalledTimes(1);
        }));
    });
    describe(seeAvailableRoute_controller_1.default.skipPage, () => {
        it('should popup the modal for skip page', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(seeAvailableRoute_helpers_1.default, 'popModalForSkipPage').mockResolvedValue(null);
            yield seeAvailableRoute_controller_1.default.skipPage(user_route_mocks_1.payload);
            expect(seeAvailableRoute_helpers_1.default.popModalForSkipPage)
                .toHaveBeenCalledWith(user_route_mocks_1.payload, state);
        }));
    });
    describe(seeAvailableRoute_controller_1.default.handleSkipPage, () => {
        it('should handle skip page', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(seeAvailableRoute_controller_1.default, 'getAllRoutes').mockReturnValueOnce(user_route_mocks_1.blockMessage);
            jest.spyOn(updatePastMessageHelper_1.default, 'sendMessage').mockReturnValueOnce(null);
            yield seeAvailableRoute_controller_1.default.handleSkipPage(user_route_mocks_1.skipPayload, { pageNumber: '2' }, modalRespond);
            expect(seeAvailableRoute_controller_1.default.getAllRoutes).toHaveBeenCalledTimes(1);
            expect(updatePastMessageHelper_1.default.sendMessage).toHaveBeenCalledTimes(1);
        }));
        it('should respond with error when it fails to skip a page', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(seeAvailableRoute_controller_1.default, 'getAllRoutes').mockReturnValueOnce(user_route_mocks_1.blockMessage);
            yield seeAvailableRoute_controller_1.default.handleSkipPage(user_route_mocks_1.unCompletePayload, {}, modalRespond);
            expect(seeAvailableRoute_controller_1.default.getAllRoutes).toHaveBeenCalledTimes(0);
        }));
    });
});
//# sourceMappingURL=seeAvailableRoute.controller.spec.js.map