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
const axios_1 = __importDefault(require("axios"));
const GoogleMapsDistanceMatrix_1 = __importDefault(require("../GoogleMapsDistanceMatrix"));
const __mocks__1 = require("../__mocks__");
describe('Calculate distance test', () => {
    it('should be calculate the distance between two addresses', () => __awaiter(void 0, void 0, void 0, function* () {
        axios_1.default.get = jest.fn(() => (__mocks__1.calculateDistanceMock));
        const result = yield GoogleMapsDistanceMatrix_1.default.calculateDistance('1.272, 30.33', '1.2223, 32.222');
        expect(result).toEqual({ distanceInKm: '1.272, 30.33', distanceInMetres: '1.2223, 32.222' });
    }));
    it('should not break the app if no key is provided', () => __awaiter(void 0, void 0, void 0, function* () {
        axios_1.default.get = jest.fn(() => (__mocks__1.noGoogleKeysMock));
        const result = yield GoogleMapsDistanceMatrix_1.default.calculateDistance('1.272, 30.33', '1.2223, 32.222');
        expect(result).toEqual({ distanceInKm: 'unknown', distanceInMetres: 'unknown' });
    }));
    it('should return null if invalid location is provided', () => __awaiter(void 0, void 0, void 0, function* () {
        axios_1.default.get = jest.fn(() => (__mocks__1.invalidLocationMock));
        const result = yield GoogleMapsDistanceMatrix_1.default.calculateDistance('30, 90', 'undefined, 90');
        expect(result).toEqual({
            distanceInKm: null,
            distanceInMetres: null
        });
    }));
    it('should return error when trying to get the distance between two addresses', () => __awaiter(void 0, void 0, void 0, function* () {
        const errorMessage = new Error('failed');
        axios_1.default.get = jest.fn().mockRejectedValue(errorMessage);
        try {
            yield GoogleMapsDistanceMatrix_1.default.calculateDistance('lagos', 'kenya');
        }
        catch (error) {
            expect(error).toEqual(errorMessage);
        }
    }));
});
//# sourceMappingURL=GoogleMapsDistanceMatrix.spec.js.map