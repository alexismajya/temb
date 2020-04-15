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
const previewScheduleTripAttachments_1 = __importDefault(require("../previewScheduleTripAttachments"));
const SlackInteractions_mock_1 = require("../../../SlackInteractions/__mocks__/SlackInteractions.mock");
const slackHelpers_1 = __importDefault(require("../../../../../helpers/slack/slackHelpers"));
const GoogleMapsDistanceMatrix_1 = __importDefault(require("../../../../../services/googleMaps/GoogleMapsDistanceMatrix"));
describe('PreviewScheduleTripAttachments', () => {
    const tripDetails = SlackInteractions_mock_1.createTripData();
    beforeEach(() => {
        jest.spyOn(slackHelpers_1.default, 'findUserByIdOrSlackId')
            .mockResolvedValue({ name: 'dummyData' });
        jest.spyOn(previewScheduleTripAttachments_1.default, 'getDistance')
            .mockImplementation((plat, plng, desLat, desLng) => {
            if (desLat && desLng && plat && plng)
                return '5km';
            return 'unknown';
        });
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('should preview a user schedule trip if location is confirmed on map', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield previewScheduleTripAttachments_1.default.previewScheduleTripAttachments(tripDetails);
        expect(result.length).toBe(9);
    }));
    it('should preview a user schedule trip if othersDestination is selected', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(previewScheduleTripAttachments_1.default, 'saveDistance').mockImplementation((a, b) => [a, b]);
        tripDetails.forSelf = 'true';
        tripDetails.othersDestination = 'Lagos';
        const result = yield previewScheduleTripAttachments_1.default.previewScheduleTripAttachments(tripDetails);
        expect(result.length).toBe(9);
        expect(previewScheduleTripAttachments_1.default.saveDistance).toHaveBeenCalledWith(tripDetails, expect.any(String));
        jest.restoreAllMocks();
    }));
    it('should preview "someone" schedule trip if location is confirmed on map', () => __awaiter(void 0, void 0, void 0, function* () {
        tripDetails.forSelf = 'false';
        jest.spyOn(previewScheduleTripAttachments_1.default, 'getRider')
            .mockResolvedValue({
            name: 'dummyData'
        });
        const result = yield previewScheduleTripAttachments_1.default.previewScheduleTripAttachments(tripDetails);
        expect(result.length).toBe(9);
    }));
    it('should preview a user schedule trip if othersDestination is selected and there are no coords', () => __awaiter(void 0, void 0, void 0, function* () {
        tripDetails.forSelf = 'true';
        tripDetails.othersDestination = 'Lagos';
        delete tripDetails.destinationLat;
        delete tripDetails.pickupLat;
        const result = yield previewScheduleTripAttachments_1.default.previewScheduleTripAttachments(tripDetails);
        expect(result.length).toBe(8);
    }));
    it('should not preview distance if distance is "unknown"', () => __awaiter(void 0, void 0, void 0, function* () {
        tripDetails.forSelf = 'true';
        jest.spyOn(previewScheduleTripAttachments_1.default, 'getDistance')
            .mockResolvedValue('unknown');
        delete tripDetails.destinationLat;
        delete tripDetails.pickupLat;
        const result = yield previewScheduleTripAttachments_1.default.previewScheduleTripAttachments(tripDetails);
        expect(result).toBeDefined();
        expect(result.length).toBe(8);
    }));
});
describe('getRiders', () => {
    it('should return a rider\'s name if ID is found', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(slackHelpers_1.default, 'findUserByIdOrSlackId')
            .mockResolvedValue({
            name: 'dummyData'
        });
        const result = yield previewScheduleTripAttachments_1.default.getRider(4);
        expect(result).toBeDefined();
        expect(result.name).toBe('dummyData');
        jest.resetAllMocks();
    }));
    it('should return a "" if ID is not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield previewScheduleTripAttachments_1.default.getRider(40);
        jest.spyOn(slackHelpers_1.default, 'findUserByIdOrSlackId')
            .mockResolvedValue({
            name: ''
        });
        expect(result).toBeDefined();
        expect(result.name).toBe('');
    }));
});
describe('PreviewScheduleTripAttachments.calculateDistance', () => {
    const destCoords = {
        location: {
            longitude: 3.33333,
            latitude: 5.5555,
        }
    };
    beforeEach(() => {
        jest.spyOn(GoogleMapsDistanceMatrix_1.default, 'calculateDistance')
            .mockResolvedValue({ distanceInKm: '5km' });
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    it('should get the calculated driving distance', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield previewScheduleTripAttachments_1.default.getDistance(1, 1, destCoords);
        expect(result).toBeDefined();
        expect(result).toBe('5km');
    }));
    it('should get the calculated driving distance if selected from Google maps', () => __awaiter(void 0, void 0, void 0, function* () {
        const destCoords2 = {
            destinationLat: 1.1111,
            destinationLong: 2.3333
        };
        const result = yield previewScheduleTripAttachments_1.default.getDistance(1, 1, destCoords2);
        expect(result).toBeDefined();
        expect(result).toBe('5km');
    }));
});
//# sourceMappingURL=previewScheduleTripAttachments.spec.js.map