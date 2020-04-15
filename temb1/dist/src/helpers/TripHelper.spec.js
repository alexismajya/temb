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
const TripHelper_1 = __importDefault(require("./TripHelper"));
const cache_1 = __importDefault(require("../modules/shared/cache"));
const address_service_1 = require("../modules/addresses/address.service");
const SlackInteractions_mock_1 = require("../modules/slack/SlackInteractions/__mocks__/SlackInteractions.mock");
describe('TripHelper', () => {
    it('should validate ', () => {
        let result = TripHelper_1.default.cleanDateQueryParam({ departureTime: 'after:2018-10-10;before:2018-01-10' }, 'departureTime');
        expect(result).toEqual({ after: '2018-10-10', before: '2018-01-10' });
        result = TripHelper_1.default.cleanDateQueryParam({ departureTime: 'after:2018-10-10' }, 'departureTime');
        expect(result).toEqual({ after: '2018-10-10' });
        result = TripHelper_1.default.cleanDateQueryParam({ departureTime: 'before:2018-01-10' }, 'departureTime');
        expect(result)
            .toEqual({
            before: '2018-01-10'
        });
        result = TripHelper_1.default.cleanDateQueryParam({ departureTime: 'before' }, 'departureTime');
        expect(result)
            .toEqual({
            before: undefined
        });
        result = TripHelper_1.default.cleanDateQueryParam({ departureTime: 'besfore:121212;afefd:1212122' }, 'usefc');
        expect(result)
            .toEqual(undefined);
    });
    describe('#tripHasProvider', () => {
        it('should return true', () => {
            const tripHasProvider = TripHelper_1.default.tripHasProvider(SlackInteractions_mock_1.tripRequestDetails);
            expect(tripHasProvider).toEqual(true);
        });
        it('should return false', () => {
            const trip = { providerId: null };
            const tripHasProvider = TripHelper_1.default.tripHasProvider(trip);
            expect(tripHasProvider).toEqual(false);
        });
    });
});
describe('TripHelper for Schedule Trip', () => {
    const userTripData = {
        department: { value: '1' }
    };
    const location = {
        location: {
            id: 2,
            longitude: 1.2222,
            latitude: 56.5555
        }
    };
    beforeEach(() => {
        jest.spyOn(address_service_1.addressService, 'findCoordinatesByAddress').mockImplementation((address) => {
            if (address === 'pickup' || address === 'dummy') {
                return location;
            }
            return null;
        });
        jest.spyOn(cache_1.default, 'saveObject').mockResolvedValue({});
        jest.spyOn(cache_1.default, 'fetch').mockResolvedValue(userTripData);
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    it('should update the trip data and save in cache - updateTripData', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield TripHelper_1.default
            .updateTripData('1', 'dummy', 'pickup', 'othersPickup', '2018-10-10');
        expect(result.pickupLat).toBe(56.5555);
        expect(result.pickupLong).toBe(1.2222);
    }));
    it('should return coordinates for preset destination - "getDestinationCoordinates"', () => __awaiter(void 0, void 0, void 0, function* () {
        const tripDetails = SlackInteractions_mock_1.tripRequestDetails();
        const result = yield TripHelper_1.default
            .getDestinationCoordinates('dummy', tripDetails);
        expect(result).toHaveProperty('destinationLat');
        expect(result).toHaveProperty('destinationLong');
        expect(result.destinationLat).toBe(56.5555);
    }));
    it('should not save pickup coords if "Others" is selected  - "updateTripData"', () => __awaiter(void 0, void 0, void 0, function* () {
        const tripDetail = {
            pickup: 'Others',
            othersPickup: 'others_pickup',
            date_time: '10/10/2018 22:00',
            department: {
                value: 1
            }
        };
        jest.spyOn(cache_1.default, 'fetch').mockResolvedValue(tripDetail);
        const result = yield TripHelper_1.default
            .updateTripData('1', 'dummy', 'Others', 'othersPickup', '2018-10-10');
        expect(result.departmentId).toEqual(1);
        expect(result.tripType).toEqual('Regular Trip');
        expect(result.pickupId).toBeUndefined();
    }));
    it('should return tripDetail without destinationLat  - "getDestinationCoordinates"', () => __awaiter(void 0, void 0, void 0, function* () {
        const tripDetails = SlackInteractions_mock_1.tripRequestDetails();
        const result = yield TripHelper_1.default
            .getDestinationCoordinates('Others', tripDetails);
        expect(result.destinationLat).toBeUndefined();
    }));
});
describe('Trip approval Date test', () => {
    it('should return a new trip approval date format', () => {
        const timeStamp = 1564005209482;
        const newApprovalDateFormat = TripHelper_1.default.convertApprovalDateFormat(timeStamp);
        const [date] = newApprovalDateFormat.split('T');
        expect(date).toEqual('2019-07-24');
    });
});
//# sourceMappingURL=TripHelper.spec.js.map