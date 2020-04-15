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
Object.defineProperty(exports, "__esModule", { value: true });
const location_controller_1 = require("../location.controller");
const location_service_1 = require("../__mocks__/location.service");
const logger_1 = require("../../shared/logging/__mocks__/logger");
describe(location_controller_1.LocationController, () => {
    let locationController;
    const res = {
        status() {
            return this;
        },
        json() {
            return this;
        },
        send() {
            return this;
        },
    };
    beforeAll(() => {
        locationController = new location_controller_1.LocationController(location_service_1.mockLocationService, logger_1.mockLogger);
    });
    beforeEach(() => {
        jest.spyOn(res, 'status');
        jest.spyOn(res, 'json');
        jest.spyOn(res, 'send');
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    describe(location_controller_1.LocationController.prototype.getLocation, () => {
        let testLocation;
        const newReq = {
            params: {
                id: 1,
            },
        };
        const { params: { id } } = newReq;
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            testLocation = yield location_service_1.mockLocationService.createLocation(1.34, 45.45);
            newReq.params.id = testLocation.id;
        }));
        it('returns a single location', () => __awaiter(void 0, void 0, void 0, function* () {
            yield locationController.getLocation(newReq, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                location: expect.objectContaining({
                    id: testLocation.id,
                    longitude: testLocation.longitude,
                }),
            });
        }));
    });
});
//# sourceMappingURL=location.controller.spec.js.map