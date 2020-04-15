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
const RouteInputHandlerHelper_1 = __importDefault(require("../RouteInputHandlerHelper"));
const cache_1 = __importDefault(require("../../../shared/cache"));
const partner_service_1 = require("../../../partners/partner.service");
const engagement_service_1 = require("../../../engagements/engagement.service");
const slackHelpers_1 = __importDefault(require("../../../../helpers/slack/slackHelpers"));
const address_service_1 = require("../../../addresses/address.service");
const dummyMockData_1 = __importDefault(require("./dummyMockData"));
const route_request_service_1 = __importDefault(require("../../../routes/route-request.service"));
const GoogleMapsDistanceMatrix_1 = __importDefault(require("../../../../services/googleMaps/GoogleMapsDistanceMatrix"));
const GoogleMapsStatic_1 = __importDefault(require("../../../../services/googleMaps/GoogleMapsStatic"));
const googleMapsHelpers_1 = require("../../../../helpers/googleMaps/googleMapsHelpers");
describe('RouteInputHandlerHelper', () => {
    describe('RouteInputHandlerHelper_saveRouteRequestDependencies', () => {
        beforeEach(() => {
            const { destinationInfo, depData: { engagement, manager, fellowBusStop, fellowHomeAddress } } = dummyMockData_1.default;
            jest.spyOn(cache_1.default, 'fetch').mockResolvedValueOnce(destinationInfo);
            jest.spyOn(partner_service_1.partnerService, 'findOrCreatePartner').mockResolvedValue([]);
            jest.spyOn(engagement_service_1.engagementService, 'findOrCreateEngagement').mockResolvedValue(engagement);
            jest.spyOn(slackHelpers_1.default, 'findOrCreateUserBySlackId').mockResolvedValue(manager);
            jest.spyOn(address_service_1.addressService, 'createNewAddress')
                .mockResolvedValue(Object.assign(Object.assign({}, fellowBusStop), fellowHomeAddress));
        });
        it('Should save route and engagement information to database', () => __awaiter(void 0, void 0, void 0, function* () {
            const { partnerInfo: { userId, teamId, managerSlackId, partnerName, workingHours } } = dummyMockData_1.default;
            const submissionValues = {
                submission: { manager: managerSlackId, nameOfPartner: partnerName, workingHours }
            };
            jest.spyOn(cache_1.default, 'fetch').mockResolvedValueOnce(['12/01/2018', '12/12/2020', 'Safaricom']);
            yield RouteInputHandlerHelper_1.default.saveRouteRequestDependencies(userId, teamId, submissionValues);
            expect(engagement_service_1.engagementService.findOrCreateEngagement).toBeCalled();
            expect(partner_service_1.partnerService.findOrCreatePartner).toBeCalled();
        }));
        it('Should return an object with the user Info', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(cache_1.default, 'fetch').mockResolvedValueOnce(['12/01/2018', '12/12/2020', 'Safaricom']);
            const { partnerInfo: { userId, teamId, managerSlackId, partnerName, workingHours }, depData, } = dummyMockData_1.default;
            const submissionValues = {
                submission: { manager: managerSlackId, nameOfPartner: partnerName, workingHours }
            };
            const res = yield RouteInputHandlerHelper_1.default.saveRouteRequestDependencies(userId, teamId, submissionValues);
            expect(res).toEqual(depData);
        }));
    });
    describe('RouteInputHandlerHelper_resolveRouteRequestDBData', () => {
        it('should ', () => __awaiter(void 0, void 0, void 0, function* () {
            const { locationInfo, depData } = dummyMockData_1.default;
            const res = yield RouteInputHandlerHelper_1.default.resolveRouteRequestDBData(locationInfo, depData);
            expect(res).toEqual({
                engagementId: '1233',
                managerId: '1233',
                homeId: '1233',
                busStopId: '1233',
                routeImageUrl: 'http://dummymapurl.com/700*730, 36.886215',
                distance: 2,
                busStopDistance: 2
            });
        }));
    });
    describe('RouteInputHandlerHelper_handleRouteRequestSubmission', () => {
        const { partnerInfo: { userId, teamId }, locationInfo } = dummyMockData_1.default;
        beforeEach(() => {
            jest.spyOn(cache_1.default, 'fetch').mockResolvedValue({ locationInfo });
            jest.spyOn(route_request_service_1.default, 'createRoute').mockResolvedValue([]);
            jest.spyOn(RouteInputHandlerHelper_1.default, 'saveRouteRequestDependencies').mockResolvedValue([]);
            jest.spyOn(RouteInputHandlerHelper_1.default, 'resolveRouteRequestDBData').mockResolvedValue([]);
        });
        it('should submit request info', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                user: { id: userId },
                team: { id: teamId },
                actions: [{ value: '{"result":1}' }]
            };
            yield RouteInputHandlerHelper_1.default.handleRouteRequestSubmission(payload);
            expect(route_request_service_1.default.createRoute).toBeCalled();
        }));
    });
    describe('RouteInputHandlerHelper_calculateDistance', () => {
        beforeEach(() => {
            jest.spyOn(GoogleMapsDistanceMatrix_1.default, 'calculateDistance').mockResolvedValue([]);
            jest.spyOn(RouteInputHandlerHelper_1.default, 'validateDistance').mockResolvedValue([]);
        });
        afterEach(() => {
            jest.resetAllMocks();
            jest.restoreAllMocks();
        });
        it('should return the calculated distance', () => __awaiter(void 0, void 0, void 0, function* () {
            const { destinationInfo: { busStop, homeAddress } } = dummyMockData_1.default;
            const theDojo = { location: { latitude: '-29923', longitude: '8539' } };
            yield RouteInputHandlerHelper_1.default.calculateDistance(busStop, homeAddress, theDojo);
            expect(RouteInputHandlerHelper_1.default.validateDistance).toBeCalled();
        }));
    });
    describe('RouteInputHandlerHelper_validateDistance', () => {
        it('should throw an error when distance is not valid', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = RouteInputHandlerHelper_1.default.validateDistance();
            const expectedRes = {
                errors: [
                    {
                        error: 'Unable to calculate distance', name: 'selectBusStop'
                    }
                ]
            };
            expect(res).toEqual(expectedRes);
        }));
        it('should check if distance is less than 2km', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = RouteInputHandlerHelper_1.default.validateDistance({
                distanceInMetres: 2001
            });
            const expectedRes = {
                errors: [
                    {
                        error: 'Selected bus stop is more than 2km from home', name: 'selectBusStop'
                    }
                ]
            };
            expect(res).toEqual(expectedRes);
        }));
        it('should return an empty', () => {
            const res = RouteInputHandlerHelper_1.default.validateDistance('test');
            expect(res).toBeFalsy();
        });
    });
    describe('RouteInputHandlerHelper_convertStringToUrl', () => {
        it('should convert a string to Url', () => {
            const { locationInfo: { staticMapUrl } } = dummyMockData_1.default;
            const result = RouteInputHandlerHelper_1.default.convertStringToUrl(staticMapUrl);
            expect(result).toContain('%20');
        });
        it('should remove any space in the Url ', () => {
            const { locationInfo: { staticMapUrl } } = dummyMockData_1.default;
            const result = RouteInputHandlerHelper_1.default.convertStringToUrl(staticMapUrl);
            expect(result).not.toContain(' ');
        });
    });
    describe('RouteInputHandlerHelper_getLocationDetailsFromCache', () => {
        const { cacheData } = dummyMockData_1.default;
        beforeEach(() => {
            jest.spyOn(cache_1.default, 'fetch').mockResolvedValue({ busStop: [...cacheData] });
        });
        afterEach(() => {
            jest.resetAllMocks();
        });
        it('should fetch value from cache', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = { user: { id: 2 } };
            yield RouteInputHandlerHelper_1.default.getLocationDetailsFromCache(payload, 'busStop', '-1.2329135,36.893683');
            expect(cache_1.default.fetch).toBeCalled();
        }));
        it('should return an object value ', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = { user: { id: 2 } };
            const result = yield RouteInputHandlerHelper_1.default.getLocationDetailsFromCache(payload, 'busStop', '-1.2329135,36.893683');
            const mockedResult = {
                address: 'Bus and Matatu Park', latitude: '-1.2329135', longitude: '36.893683'
            };
            expect(result).toEqual(mockedResult);
        }));
        it('should return null when it cannot find matching coordinate', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = { user: { id: 1 } };
            const coordinate = '-1.2329135, 6.893683';
            const result = yield RouteInputHandlerHelper_1.default.getLocationDetailsFromCache(payload, 'busStop', coordinate);
            expect(result).toEqual(null);
        }));
        it('should always return ', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(cache_1.default, 'fetch').mockResolvedValue({});
            const payload = { user: { id: 1 } };
            const result = yield RouteInputHandlerHelper_1.default.getLocationDetailsFromCache(payload, 'busStop');
            expect(result).toBeFalsy();
        }));
    });
    describe('RouteInputHandlerHelper_getLongLat', () => {
        it('should return out longitude and latitude from coordinate as an object', () => {
            const mockCoordinate = '-1.2329135,36.893683';
            const result = RouteInputHandlerHelper_1.default.getLongLat(mockCoordinate);
            expect(result).toEqual({ latitude: '-1.2329135', longitude: '36.893683' });
        });
    });
    describe('RouteInputHandlerHelper_savePreviewDataToCache', () => {
        beforeEach(() => {
            jest.spyOn(cache_1.default, 'save').mockResolvedValue();
        });
        it('Populate cache with data', () => __awaiter(void 0, void 0, void 0, function* () {
            const { locationInfo: { staticMapUrl, homeToDropOffDistance, dojoToDropOffDistance }, destinationInfo: { busStop: savedBusStop, homeAddress: savedHomeAddress, } } = dummyMockData_1.default;
            const previewData = {
                staticMapUrl, homeToDropOffDistance, dojoToDropOffDistance, savedBusStop, savedHomeAddress
            };
            const key = 1;
            yield RouteInputHandlerHelper_1.default.savePreviewDataToCache(key, previewData);
            expect(cache_1.default.save).toBeCalled();
        }));
    });
    describe('RouteInputHandlerHelper_resolveDestinationPreviewData', () => {
        const { cacheData, locationInfo: { staticMapUrl }, destinationInfo: { busStop: coordinate } } = dummyMockData_1.default;
        beforeEach(() => {
            jest.spyOn(RouteInputHandlerHelper_1.default, 'getLocationDetailsFromCache')
                .mockResolvedValue(cacheData);
            jest.spyOn(GoogleMapsStatic_1.default, 'getPathFromDojoToDropOff').mockResolvedValue(staticMapUrl);
            jest.spyOn(googleMapsHelpers_1.RoutesHelper, 'getDojoCoordinateFromDb').mockResolvedValue(coordinate);
            jest.spyOn(RouteInputHandlerHelper_1.default, 'calculateDistance').mockResolvedValue(coordinate);
            jest.spyOn(RouteInputHandlerHelper_1.default, 'convertStringToUrl').mockResolvedValue(coordinate);
        });
        it('it should return destination url', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = { submission: { otherBusStop: null } };
            yield RouteInputHandlerHelper_1.default.resolveDestinationPreviewData(payload, coordinate);
            expect(RouteInputHandlerHelper_1.default.convertStringToUrl).toBeCalled();
        }));
        it('it should return the calculated distance', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = { submission: { otherBusStop: null } };
            yield RouteInputHandlerHelper_1.default.resolveDestinationPreviewData(payload, coordinate);
            expect(RouteInputHandlerHelper_1.default.calculateDistance).toBeCalled();
        }));
    });
    describe('use Google Plus code when location is not listed', () => {
        const { busStop } = dummyMockData_1.default;
        beforeEach(() => {
            jest.spyOn(cache_1.default, ('fetch')).mockResolvedValue(busStop);
        });
        afterEach(() => {
            jest.resetAllMocks();
        });
        it('Should return the input dropoff location from cache', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = { user: { id: 2 }, submission: { otherBusStop: 'PVM5+HR Nairobi, Kenya' } };
            yield RouteInputHandlerHelper_1.default.getLocation(payload, 'dropOffAddress', '-1.2329135,36.893683');
            expect(cache_1.default.fetch).toHaveBeenCalled();
        }));
    });
});
describe('checkIfAddressExistOnDatabase', () => {
    const databaseMockResult = [{
            address: 'Andela Nairobi',
            get: () => ({
                location: {
                    latitude: '1.2356',
                    longitude: '-0.8966'
                }
            })
        },
        {
            address: 'Nairobi, Nairobi kenya',
            get: () => ({
                location: {
                    latitude: '1.2556',
                    longitude: '-0.8866'
                }
            })
        }];
    it('Should return true if route exist', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(address_service_1.addressService, 'findAddressIfExists').mockResolvedValue(databaseMockResult);
        jest.spyOn(cache_1.default, 'save');
        const respond = jest.fn();
        const payload = { user: { id: 1 } };
        const result = yield RouteInputHandlerHelper_1.default
            .checkIfAddressExistOnDatabase(payload, respond, 'Nairobi');
        expect(result).toBe(true);
    }));
    it("Should return false if route doesn't exist", (done) => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(address_service_1.addressService, 'findAddressIfExists').mockResolvedValue([]);
        jest.spyOn(cache_1.default, 'save');
        const respond = jest.fn();
        const payload = { user: { id: 1 } };
        const result = yield RouteInputHandlerHelper_1.default
            .checkIfAddressExistOnDatabase(payload, respond, 'Nairobi');
        expect(result).toBe(false);
        done();
    }));
});
describe('cacheLocationAddress', () => {
    it('should cache address', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = {
            user: {
                id: 2
            },
            actions: [{
                    selected_options: [{
                            value: JSON.stringify({ address: 'Andela Nairobi', value: '1.2345,-0.8999' })
                        }]
                }]
        };
        jest.spyOn(cache_1.default, 'save');
        yield RouteInputHandlerHelper_1.default.cacheLocationAddress(payload);
        expect(cache_1.default.save).toBeCalled();
        done();
    }));
});
describe('generateResolvedBusList', () => {
    const busStageList = [{
            text: 'Andela Nairobi',
            value: '1.2345,-0.8974'
        },
        {
            text: 'Andela Nairobi',
            value: '1.2345,-0.8974'
        }];
    const payload = { user: { id: 1 } };
    it('should return a list of routes', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(googleMapsHelpers_1.RoutesHelper, 'verifyDistanceBetween').mockResolvedValue([{
                busStop: {
                    text: 'Andela Nairobi',
                    value: '1.2345,-0.8974'
                },
                valid: true
            }]);
        const result = yield RouteInputHandlerHelper_1.default
            .generateResolvedBusList(busStageList, 'Nairobi', payload);
        expect(result).toEqual(busStageList);
        expect(cache_1.default.save).toBeCalled();
    }));
});
//# sourceMappingURL=RouteInputHandlerHelper.spec.js.map