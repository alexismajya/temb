var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
import { GoogleMapsService } from './googlemaps.service';
import { mapsAPILoaderMock, mockWindowObject, mockAddress, mockCoordinates, mockResponse } from './__mocks__/googlemaps.mock';
describe('CreateRouteComponent', function () {
    var component;
    var element;
    beforeEach(function () {
        component = new GoogleMapsService(mapsAPILoaderMock);
        mockWindowObject();
    });
    afterEach(function () {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
    it('should initialize googlemaps', function () {
        var geocoder = jest.spyOn(window.google.maps, 'Geocoder');
        var autocomplete = jest.spyOn(window.google.maps.places, 'Autocomplete');
        element = '<input />';
        component.initLibraries(element);
        expect(geocoder).toHaveBeenCalled();
        expect(autocomplete).toHaveBeenCalledWith(element, { types: ['address'] });
    });
    it('should load googlemaps', function () { return __awaiter(_this, void 0, void 0, function () {
        var initLibraries, load;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    initLibraries = jest.spyOn(component, 'initLibraries');
                    load = jest.spyOn(component.mapLoader, 'load');
                    return [4 /*yield*/, component.loadGoogleMaps(element)];
                case 1:
                    _a.sent();
                    expect(load).toHaveBeenCalled();
                    expect(initLibraries).toHaveBeenCalledWith(element);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should get location address from given coordinates', function () { return __awaiter(_this, void 0, void 0, function () {
        var locationLookup, retriever, address;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    locationLookup = jest.spyOn(component, 'lookUpAddressOrCoordinates')
                        .mockReturnValue(mockResponse);
                    retriever = jest.spyOn(component, 'retrieveLocationDetails')
                        .mockReturnValue(mockResponse.formatted_address);
                    return [4 /*yield*/, component.getLocationAddressFromCoordinates(mockCoordinates)];
                case 1:
                    address = _a.sent();
                    expect(locationLookup).toHaveBeenCalledWith(mockCoordinates, 'location');
                    expect(retriever).toHaveBeenCalledWith(mockResponse, 'address');
                    expect(address).toEqual(mockAddress);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should get location coordinates address from given address', function () { return __awaiter(_this, void 0, void 0, function () {
        var locationLookup, retriever, coordinates;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    locationLookup = jest.spyOn(component, 'lookUpAddressOrCoordinates')
                        .mockReturnValue(mockResponse);
                    retriever = jest.spyOn(component, 'retrieveLocationDetails')
                        .mockReturnValue(mockCoordinates);
                    return [4 /*yield*/, component.getLocationCoordinatesFromAddress(mockCoordinates)];
                case 1:
                    coordinates = _a.sent();
                    expect(locationLookup).toHaveBeenCalledWith(mockCoordinates, 'address');
                    expect(retriever).toHaveBeenCalledWith(mockResponse);
                    expect(coordinates).toEqual(mockCoordinates);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should retrieve coordinates from response', function () {
        var coordinates = component.retrieveLocationDetails(mockResponse);
        expect(coordinates).toEqual(mockCoordinates);
    });
    it('should retrieve address from response', function () {
        var address = component.retrieveLocationDetails(mockResponse, 'address');
        expect(address).toEqual(mockAddress);
    });
});
//# sourceMappingURL=googlemaps.service.spec.js.map