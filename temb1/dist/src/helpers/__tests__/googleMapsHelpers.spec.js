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
const googleMapsHelpers_1 = require("../googleMaps/googleMapsHelpers");
const GoogleMapsDistanceMatrix_1 = __importDefault(require("../../services/googleMaps/GoogleMapsDistanceMatrix"));
const googleMapHelpersMock_1 = require("../__mocks__/googleMapHelpersMock");
const address_service_1 = require("../../modules/addresses/address.service");
describe('Marker', () => {
    it('should construct a new marker', () => {
        const marker = new googleMapsHelpers_1.Marker('blue', 'A');
        expect(marker).toEqual({
            color: 'blue',
            label: 'A',
            locations: ''
        });
    });
    it('should construct a new marker with default parameters', () => {
        const marker = new googleMapsHelpers_1.Marker();
        expect(marker).toEqual({
            color: 'blue',
            label: '',
            locations: ''
        });
    });
    it('should add a location to marker', () => {
        const marker = new googleMapsHelpers_1.Marker('blue', 'A');
        marker.addLocation('Lagos');
        expect(marker).toEqual({
            color: 'blue',
            label: 'A',
            locations: '|Lagos'
        });
    });
});
describe('getDojoCoordinateFromDb', () => {
    beforeEach(() => {
        jest.spyOn(address_service_1.addressService, 'findAddress').mockResolvedValue(null);
    });
    it('should throw an error when it cannot find dojo location in the database', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield googleMapsHelpers_1.RoutesHelper.getDojoCoordinateFromDb();
        }
        catch (err) {
            expect(err).toEqual(new Error('Cannot find The Dojo location in the database'));
        }
    }));
    it('should get the location of dojo from the database', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(address_service_1.addressService, 'findAddress').mockResolvedValue({ coordinate: '12038902,-212131232' });
        const res = yield googleMapsHelpers_1.RoutesHelper.getDojoCoordinateFromDb();
        expect(res).toBeTruthy();
        expect(res).toHaveProperty('coordinate');
    }));
});
describe('home-busStop route Helper test', () => {
    it('should verify distance between home and busStop and return Acceptable message', () => __awaiter(void 0, void 0, void 0, function* () {
        GoogleMapsDistanceMatrix_1.default.calculateDistance = googleMapHelpersMock_1.validHomeBStopMock;
        const result = yield googleMapsHelpers_1.RoutesHelper.distanceBetweenDropoffAndHome('busStop, home');
        expect(result).toEqual('Acceptable Distance');
    }));
    it('should verify distance between home and busStop and return UnAcceptable message', () => __awaiter(void 0, void 0, void 0, function* () {
        GoogleMapsDistanceMatrix_1.default.calculateDistance = googleMapHelpersMock_1.invalidHomeBStopMock;
        const result = yield googleMapsHelpers_1.RoutesHelper.distanceBetweenDropoffAndHome('busStop, home');
        expect(result).toEqual("Your Bus-stop can't be more than 2km away from your Home");
    }));
    it('should verify distance between home and busStop and return error message', () => __awaiter(void 0, void 0, void 0, function* () {
        const errorMessage = new Error('failed');
        GoogleMapsDistanceMatrix_1.default.calculateDistance = jest.fn(() => {
            throw errorMessage;
        });
        try {
            yield googleMapsHelpers_1.RoutesHelper.distanceBetweenDropoffAndHome('busStop, home');
        }
        catch (error) {
            expect(error).toEqual(errorMessage);
        }
    }));
});
//# sourceMappingURL=googleMapsHelpers.spec.js.map