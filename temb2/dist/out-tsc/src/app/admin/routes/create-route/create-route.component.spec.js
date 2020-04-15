var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import { CreateRouteComponent } from './create-route.component';
import { CreateRouteHelper } from './create-route.helper';
import { takeOffTimeFormat } from './createRouteUtils';
import { googleMapsServiceMock, homebaseServiceMock, locationServiceMock, routeServiceMock, createRouteHelperMock, routerMock, toastrMock, navMenuServiceMock, routeInfo } from '../__mocks__/create-route';
var mockCoordinates = { lat: -1.87637, lng: 36.89373 };
var mockAddress = '5, alien road, Pluto Ticket Point, Jupitar.';
var analyticsMock = {
    sendPageView: jest.fn(),
    sendEvent: jest.fn()
};
describe('CreateRouteComponent', function () {
    var component;
    beforeEach(function () {
        component = new CreateRouteComponent(googleMapsServiceMock, homebaseServiceMock, locationServiceMock, routeServiceMock, createRouteHelperMock, routerMock, navMenuServiceMock, analyticsMock);
        component.destinationInputElement = { nativeElement: { value: 'someValue' } };
    });
    afterEach(function () {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
    it('should load google maps', function () {
        var loadGoogleMaps = jest.spyOn(component.googleMapsService, 'loadGoogleMaps');
        component.ngAfterViewInit();
        expect(loadGoogleMaps).toHaveBeenCalled();
    });
    it('should show route on map when executed', function () { return __awaiter(_this, void 0, void 0, function () {
        var updateRoute, getCoordinates;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    updateRoute = jest.spyOn(component, 'updateRouteDisplay');
                    getCoordinates = jest.spyOn(component.googleMapsService, 'getLocationCoordinatesFromAddress');
                    return [4 /*yield*/, component.showRouteDirectionOnClick()];
                case 1:
                    _a.sent();
                    expect(getCoordinates).toHaveBeenCalled();
                    expect(updateRoute).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should throw an error if location does not exist', function () { return __awaiter(_this, void 0, void 0, function () {
        var updateRoute, getCoordinates, notifyUser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    updateRoute = jest.spyOn(component, 'updateRouteDisplay');
                    getCoordinates = jest.spyOn(component.googleMapsService, 'getLocationCoordinatesFromAddress').mockRejectedValue('Location not found');
                    notifyUser = jest.spyOn(component.createRouteHelper, 'notifyUser');
                    return [4 /*yield*/, component.showRouteDirectionOnClick()];
                case 1:
                    _a.sent();
                    expect(notifyUser).toHaveBeenCalledWith(['Location not found']);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should update Destination form Field with coordinates address when the map marker is dragged', function () { return __awaiter(_this, void 0, void 0, function () {
        var updateRoute, getAddress;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    updateRoute = jest.spyOn(component, 'updateRouteDisplay');
                    getAddress = jest.spyOn(component.googleMapsService, 'getLocationAddressFromCoordinates').mockReturnValue(Promise.resolve(mockAddress));
                    return [4 /*yield*/, component.updateDestinationFieldOnMarkerDrag('Marker', mockCoordinates)];
                case 1:
                    _a.sent();
                    expect(getAddress).toHaveBeenCalled();
                    expect(component.model.destinationInputField).toEqual(mockAddress);
                    expect(updateRoute).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should clear destination coordinates when user changes the destination input field', function () {
        component.destinationCoordinates = mockCoordinates;
        component.clearDestinationCoordinates();
        expect(component.destinationCoordinates).toBe(null);
    });
    it('should update coordinate variables to display route on map', function () {
        var toggleMapDisplay = jest.spyOn(component, 'toggleMapDisplay');
        component.updateRouteDisplay(mockCoordinates);
        var destination = component.destination, destinationCoordinates = component.destinationCoordinates;
        expect(destination).toEqual(mockCoordinates);
        expect(destinationCoordinates).toEqual(mockCoordinates);
        expect(toggleMapDisplay).toHaveBeenCalled();
    });
    it('should toggle maps display', function () {
        expect(component.toggleMapDisplay()).toBeUndefined();
    });
    it('should call method to increment or decrement value supplied', function () {
        var incrementer = jest.spyOn(component.createRouteHelper, 'incrementCapacity');
        var decrementer = jest.spyOn(component.createRouteHelper, 'decrementCapacity').mockReturnValue(2);
        component.changeCapacityValue('incrementCapacity');
        component.changeCapacityValue('decrementCapacity');
        expect(incrementer).toHaveBeenCalled();
        expect(decrementer).toHaveBeenCalled();
        expect(component.model.capacity).toEqual(2);
    });
    it('should display an error message if destination coordinates are not set.', function () {
        component.destinationCoordinates = undefined;
        var notifyUser = jest.spyOn(component.createRouteHelper, 'notifyUser');
        component.createRoute('formValues');
        expect(notifyUser).toHaveBeenCalled();
    });
    it('should display error messages if submitted form contains errors', function () {
        component.destinationCoordinates = mockCoordinates;
        var notifyUser = jest.spyOn(component.createRouteHelper, 'notifyUser');
        var createObj = jest.spyOn(component.createRouteHelper, 'createNewRouteRequestObject')
            .mockReturnValue({});
        var validator = jest.spyOn(component.createRouteHelper, 'validateFormEntries')
            .mockReturnValue(['fail validation', 'another failed validation']);
        component.createRoute();
        expect(notifyUser).toHaveBeenCalled();
        expect(createObj).toHaveBeenCalled();
        expect(validator).toHaveBeenCalled();
    });
    it('should send validated data to the server', function () { return __awaiter(_this, void 0, void 0, function () {
        var formValues, sendRequestToServer, validator, createObj;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    component.destinationCoordinates = mockCoordinates;
                    formValues = { someProp: 'someValue' };
                    sendRequestToServer = jest.spyOn(component, 'sendRequestToServer').mockResolvedValue(Promise.resolve());
                    validator = jest.spyOn(component.createRouteHelper, 'validateFormEntries')
                        .mockReturnValue([]);
                    createObj = jest.spyOn(component.createRouteHelper, 'createNewRouteRequestObject')
                        .mockReturnValue(formValues);
                    return [4 /*yield*/, component.createRoute()];
                case 1:
                    _a.sent();
                    expect(createObj).toHaveBeenCalled();
                    expect(validator).toHaveBeenCalled();
                    expect(sendRequestToServer).toHaveBeenCalledWith(formValues);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should display a success message if post request is successful', function () { return __awaiter(_this, void 0, void 0, function () {
        var response, notifyUser, navigate, routeService;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    response = { message: 'Route created successfully' };
                    notifyUser = jest.spyOn(component.createRouteHelper, 'notifyUser');
                    navigate = jest.spyOn(component.router, 'navigate');
                    routeService = jest.spyOn(component.routeService, 'createRoute')
                        .mockResolvedValue(response);
                    return [4 /*yield*/, component.sendRequestToServer(routeInfo)];
                case 1:
                    _a.sent();
                    expect(routeService).toHaveBeenCalledWith(routeInfo);
                    expect(notifyUser).toHaveBeenCalledWith([response.message], 'success');
                    expect(navigate).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should display an error message if post request is unsuccessful', function () { return __awaiter(_this, void 0, void 0, function () {
        var response, notifyUser, routeService;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    response = { error: { message: 'some server error' } };
                    notifyUser = jest.spyOn(component.createRouteHelper, 'notifyUser');
                    routeService = jest.spyOn(component.routeService, 'createRoute')
                        .mockRejectedValue(response);
                    return [4 /*yield*/, component.sendRequestToServer(routeInfo)];
                case 1:
                    _a.sent();
                    expect(routeService).toHaveBeenCalledWith(routeInfo);
                    expect(notifyUser).toHaveBeenCalledWith([response.error.message]);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should display a generic error message if post request is unsuccessful', function () { return __awaiter(_this, void 0, void 0, function () {
        var response, notifyUser, routeService;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    response = { error: { someOtherError: 'some server error' } };
                    notifyUser = jest.spyOn(component.createRouteHelper, 'notifyUser');
                    routeService = jest.spyOn(component.routeService, 'createRoute')
                        .mockRejectedValue(response);
                    return [4 /*yield*/, component.sendRequestToServer(routeInfo)];
                case 1:
                    _a.sent();
                    expect(routeService).toHaveBeenCalledWith(routeInfo);
                    expect(notifyUser).toHaveBeenCalledWith(['An error occurred.']);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should set auto', function () {
        component.setAuto('uber');
        expect(component.auto).toEqual('uber');
    });
    it('should set providers to selected option', function () {
        var provider = { id: 1, name: 'uberKenya', providerUserId: 1 };
        component.getSelected(provider);
        expect(component.selectedProvider).toEqual(provider);
    });
});
describe('CreateRoute Helper Component', function () {
    var component;
    beforeEach(function () {
        component = new CreateRouteHelper(toastrMock);
    });
    afterEach(function () {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
    it('should increment a number value', function () {
        var newValue = component.incrementCapacity(1);
        expect(newValue).toBe(2);
    });
    it('should decrement a number value', function () {
        var newValue = component.decrementCapacity(2);
        expect(newValue).toBe(1);
    });
    it('should return 1 if value passed is less than 2', function () {
        var newValue = component.decrementCapacity(0);
        expect(newValue).toBe(1);
    });
    it('should add destination property with nested address and coordinate props', function () {
        var formValues = { fieldOne: 'valueOne', fieldTwo: 'valueTwo' };
        var newObject = __assign({}, formValues, { destination: { address: mockAddress, coordinates: mockCoordinates } });
        var finalObject = component.createNewRouteRequestObject(formValues, mockAddress, mockCoordinates);
        expect("" + finalObject).toEqual("" + newObject);
    });
    it('should return an error of errors if errors exists', function () {
        var formValues = { takeOffTime: 'valueOne', capacity: 'valueTwo' };
        var inputValidator = jest.spyOn(component, 'validateInputFormat')
            .mockReturnValue(['error made']);
        var capacityValidator = jest.spyOn(component, 'validateCapacity')
            .mockReturnValue(['error made again']);
        var errors = component.validateFormEntries(formValues);
        expect(inputValidator).toHaveBeenCalled();
        expect(capacityValidator).toHaveBeenCalled();
        expect(errors).toHaveLength(2);
    });
    it('should add destination property with nested address and coordinate props', function () {
        var formValues = { takeOffTime: 'valueOne', capacity: 'valueTwo' };
        var inputValidator = jest.spyOn(component, 'validateInputFormat')
            .mockReturnValue(['error made']);
        var capacityValidator = jest.spyOn(component, 'validateCapacity')
            .mockReturnValue(['error made again']);
        var errors = component.validateFormEntries(formValues);
        expect(inputValidator).toHaveBeenCalled();
        expect(capacityValidator).toHaveBeenCalled();
        expect(errors).toHaveLength(2);
    });
    it('should fail if field is invalid', function () {
        var errors = component.validateInputFormat('23:0', takeOffTimeFormat, 'Take-off Time');
        expect(errors[0]).toEqual('Take-off Time is invalid');
    });
    it('should return an empty string if field is valid', function () {
        var errors = component.validateInputFormat('23:00', takeOffTimeFormat, 'Take-off Time');
        expect(errors).toHaveLength(0);
    });
    it('should fail if value is not an integer or less than 1', function () {
        var errors = component.validateCapacity('-1', 'Capacity');
        expect(errors[0]).toEqual('Capacity must be an integer greater than zero');
    });
    it('should return an empty array if value is valid', function () {
        var errors = component.validateCapacity('5', 'Capacity');
        expect(errors).toHaveLength(0);
    });
    it('should display all messages in the array it recieves', function () {
        var toastrError = jest.spyOn(component.toastr, 'error');
        var toastrSuccess = jest.spyOn(component.toastr, 'success');
        var errorMessages = [
            'errorOne', 'errorTwo', 'errorThree', 'errorFour', 'errorFive'
        ];
        var errors = component.notifyUser(errorMessages);
        var success = component.notifyUser([errorMessages[0]], 'success');
        expect(toastrError).toHaveBeenCalledTimes(errorMessages.length);
        expect(toastrSuccess).toHaveBeenCalledTimes(1);
    });
});
//# sourceMappingURL=create-route.component.spec.js.map