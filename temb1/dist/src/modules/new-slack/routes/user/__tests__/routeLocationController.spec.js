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
const routeLocation_controller_1 = __importDefault(require("../routeLocation.controller"));
const routeLocation_helpers_1 = __importDefault(require("../routeLocation.helpers"));
const user_route_mocks_1 = require("../__mocks__/user-route-mocks");
'../../../slack/RouteManagement/JoinRoute/JoinRouteNotifications';
const LocationPrompts_1 = __importDefault(require("../../../../slack/SlackPrompts/LocationPrompts"));
describe(routeLocation_controller_1.default, () => {
    const { actionRespond } = user_route_mocks_1.dependencyMocks;
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    describe(routeLocation_controller_1.default.confirmLocation, () => {
        it('should call confirm home location message', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(routeLocation_helpers_1.default, 'confirmLocationMessage').mockReturnValueOnce(null);
            yield routeLocation_controller_1.default.confirmLocation(user_route_mocks_1.payload, actionRespond);
            expect(routeLocation_helpers_1.default.confirmLocationMessage).toHaveBeenCalled();
        }));
        it('should call send cordinates when location is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const notFoundLocPayload = {
                actions: [{ value: 'notListedLoc' }],
            };
            jest.spyOn(LocationPrompts_1.default, 'sendLocationCoordinatesNotFound').mockReturnValueOnce(null);
            yield routeLocation_controller_1.default.confirmLocation(notFoundLocPayload, actionRespond);
            expect(LocationPrompts_1.default.sendLocationCoordinatesNotFound).toHaveBeenCalled();
        }));
    });
});
//# sourceMappingURL=routeLocationController.spec.js.map