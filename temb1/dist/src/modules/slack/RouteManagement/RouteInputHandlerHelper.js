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
const GoogleMapsDistanceMatrix_1 = __importDefault(require("../../../services/googleMaps/GoogleMapsDistanceMatrix"));
const cache_1 = __importDefault(require("../../shared/cache"));
const partner_service_1 = require("../../partners/partner.service");
const engagement_service_1 = require("../../engagements/engagement.service");
const slackHelpers_1 = __importDefault(require("../../../helpers/slack/slackHelpers"));
const route_request_service_1 = __importDefault(require("../../routes/route-request.service"));
const GoogleMapsStatic_1 = __importDefault(require("../../../services/googleMaps/GoogleMapsStatic"));
const googleMapsHelpers_1 = require("../../../helpers/googleMaps/googleMapsHelpers");
const address_service_1 = require("../../addresses/address.service");
const SlackDialogModels_1 = require("../SlackModels/SlackDialogModels");
const LocationPrompts_1 = __importDefault(require("../SlackPrompts/LocationPrompts"));
exports.getNewRouteKey = (id) => `ROUTE_CREATION_${id}_v1`;
class RouteInputHandlerHelper {
    static saveRouteRequestDependencies(userId, teamId, submissionValues) {
        return __awaiter(this, void 0, void 0, function* () {
            const { busStop: { longitude: busStopLng, latitude: busStopLat, address: busStopAddress }, homeAddress: { longitude: homeLng, latitude: homeLat, address: homeAdd }, } = yield cache_1.default.fetch(exports.getNewRouteKey(userId));
            const cached = yield cache_1.default.fetch(`userDetails${userId}`);
            const partnerName = cached[2];
            const { submission: { manager: managerSlackId, workingHours } } = submissionValues;
            const [partner, manager, requester, fellowBusStop, fellowHomeAddress] = yield Promise.all([
                partner_service_1.partnerService.findOrCreatePartner(partnerName),
                slackHelpers_1.default.findOrCreateUserBySlackId(managerSlackId, teamId),
                slackHelpers_1.default.findOrCreateUserBySlackId(userId, teamId),
                address_service_1.addressService.createNewAddress(busStopLng, busStopLat, busStopAddress),
                address_service_1.addressService.createNewAddress(homeLng, homeLat, homeAdd)
            ]);
            const engagement = yield engagement_service_1.engagementService.findOrCreateEngagement(workingHours, requester, partner);
            return {
                engagement, manager, fellowBusStop, fellowHomeAddress
            };
        });
    }
    static resolveRouteRequestDBData(locationInfo, depData) {
        const { dojoToDropOffDistance, homeToDropOffDistance, staticMapUrl } = locationInfo;
        const { engagement, manager, fellowBusStop, fellowHomeAddress } = depData;
        const engagementId = engagement.id;
        const managerId = manager.id;
        const homeId = fellowHomeAddress.id;
        const busStopId = fellowBusStop.id;
        const routeImageUrl = staticMapUrl;
        const requesterId = engagement.fellowId;
        let { distanceInMetres: distance } = dojoToDropOffDistance;
        let { distanceInMetres: busStopDistance } = homeToDropOffDistance;
        distance /= 1000;
        busStopDistance /= 1000;
        return {
            engagementId,
            managerId,
            homeId,
            busStopId,
            routeImageUrl,
            distance,
            busStopDistance,
            requesterId
        };
    }
    static handleRouteRequestSubmission(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user: { id: userId }, team: { id: teamId }, actions } = payload;
            const { value } = actions[0];
            const submissionValues = JSON.parse(value);
            const [depData, cachedData] = yield Promise.all([
                RouteInputHandlerHelper.saveRouteRequestDependencies(userId, teamId, submissionValues),
                yield cache_1.default.fetch(exports.getNewRouteKey(userId))
            ]);
            const { locationInfo } = cachedData;
            const dbData = RouteInputHandlerHelper.resolveRouteRequestDBData(locationInfo, depData);
            return route_request_service_1.default.createRoute(dbData);
        });
    }
    static calculateDistance(savedBusStop, savedHomeAddress, theDojo) {
        return __awaiter(this, void 0, void 0, function* () {
            const { latitude: busStopLat, longitude: busStopLong } = savedBusStop;
            const { latitude: homeLat, longitude: homeLong } = savedHomeAddress;
            const { location: { latitude, longitude } } = theDojo;
            const dojoLocation = `${latitude}, ${longitude}`;
            const homeLocation = `${homeLat}, ${homeLong}`;
            const busStopLocation = `${busStopLat}, ${busStopLong}`;
            const [homeToDropOffDistance, dojoToDropOffDistance] = yield Promise.all([
                GoogleMapsDistanceMatrix_1.default
                    .calculateDistance(busStopLocation, homeLocation),
                GoogleMapsDistanceMatrix_1.default
                    .calculateDistance(dojoLocation, busStopLocation)
            ]);
            const validationError = RouteInputHandlerHelper.validateDistance(homeToDropOffDistance);
            return { homeToDropOffDistance, dojoToDropOffDistance, validationError };
        });
    }
    static validateDistance(homeToDropOffDistance) {
        const errors = [];
        if (!homeToDropOffDistance) {
            errors.push(new SlackDialogModels_1.SlackDialogError('selectBusStop', 'Unable to calculate distance'));
        }
        const { distanceInMetres } = homeToDropOffDistance || {};
        if (distanceInMetres > 2000) {
            errors.push(new SlackDialogModels_1.SlackDialogError('selectBusStop', 'Selected bus stop is more than 2km from home'));
        }
        let validationError;
        if (errors.length > 0) {
            validationError = {
                errors
            };
        }
        return validationError;
    }
    static getLongLat(coordinate) {
        const [latitude, longitude] = coordinate.split(',');
        return {
            latitude,
            longitude
        };
    }
    static convertStringToUrl(string) {
        return string.replace(/\s/g, '%20');
    }
    static getLocation(payload, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const location = yield cache_1.default.fetch(exports.getNewRouteKey(payload.user.id));
            const { [key]: { address, latitude, longitude } } = location;
            return { address, latitude, longitude };
        });
    }
    static getLocationDetailsFromCache(payload, key, coordinateValue = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const locationResult = yield cache_1.default.fetch(exports.getNewRouteKey(payload.user.id));
            const resultData = locationResult[key];
            if (coordinateValue) {
                const locationMatch = resultData.filter((item) => item.value === coordinateValue)
                    .map((item) => {
                    const { value: coordinate, text: address } = item;
                    return Object.assign({ address }, RouteInputHandlerHelper.getLongLat(coordinate));
                });
                if (locationMatch.length) {
                    return locationMatch[0];
                }
                return null;
            }
            return resultData;
        });
    }
    static resolveDestinationPreviewData(payload, busStopCoordinate) {
        return __awaiter(this, void 0, void 0, function* () {
            const [staticMapString, savedHomeAddress, savedBusStop, theDojo] = yield Promise.all([
                GoogleMapsStatic_1.default.getPathFromDojoToDropOff(busStopCoordinate),
                RouteInputHandlerHelper.getLocationDetailsFromCache(payload, 'homeAddress'),
                payload.submission.otherBusStop ? RouteInputHandlerHelper.getLocation(payload, 'dropOffAddress') : RouteInputHandlerHelper.getLocationDetailsFromCache(payload, 'busStageList', busStopCoordinate),
                googleMapsHelpers_1.RoutesHelper.getDojoCoordinateFromDb()
            ]);
            const { homeToDropOffDistance, dojoToDropOffDistance, validationError } = yield RouteInputHandlerHelper.calculateDistance(savedBusStop, savedHomeAddress, theDojo);
            const staticMapUrl = RouteInputHandlerHelper.convertStringToUrl(staticMapString);
            return {
                staticMapUrl,
                homeToDropOffDistance,
                dojoToDropOffDistance,
                validationError,
                savedBusStop,
                savedHomeAddress,
            };
        });
    }
    static savePreviewDataToCache(key, previewData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { staticMapUrl, homeToDropOffDistance, dojoToDropOffDistance, savedBusStop, savedHomeAddress, } = previewData;
            const locationInfo = {
                dojoToDropOffDistance,
                homeToDropOffDistance,
                staticMapUrl,
                savedHomeAddress,
                savedBusStop
            };
            yield cache_1.default.save(exports.getNewRouteKey(key), 'busStop', savedBusStop);
            yield cache_1.default.save(exports.getNewRouteKey(key), 'locationInfo', locationInfo);
        });
    }
    static checkIfAddressExistOnDatabase(payload, respond, locationSearchString) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultFromDatabase = yield address_service_1.addressService
                .findAddressIfExists(locationSearchString);
            const SuggestionForSlackSelect = resultFromDatabase
                .map(((result) => {
                const { longitude } = result.get('location');
                const { latitude } = result.get('location');
                const { address } = result;
                const requiredValue = `{ "address": "${address}", "value": "${latitude},${longitude}"}`;
                return { text: result.address, value: requiredValue };
            }));
            if (resultFromDatabase.length > 0) {
                yield cache_1.default.save(exports.getNewRouteKey(payload.user.id), 'newRouteRequest', locationSearchString);
                const suggestion = LocationPrompts_1.default
                    .sendDatbaseLocationSuggestionResponse(SuggestionForSlackSelect);
                respond(suggestion);
                return true;
            }
            return false;
        });
    }
    static cacheLocationAddress(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const locationToBeCached = JSON.parse(payload.actions[0].selected_options[0].value);
            yield cache_1.default.save(exports.getNewRouteKey(payload.user.id), 'homeAddress', {
                address: locationToBeCached.address,
                latitude: locationToBeCached.value.split(',')[0],
                longitude: locationToBeCached.value.split(',')[1]
            });
        });
    }
    static generateResolvedBusList(busStageList, location, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const filteredPromise = busStageList.map((busStop) => __awaiter(this, void 0, void 0, function* () {
                const res = yield googleMapsHelpers_1.RoutesHelper.verifyDistanceBetween(location, busStop.value, 2000);
                return { busStop, valid: res };
            }));
            const resolvedList = yield Promise.all(filteredPromise);
            const filteredBusStops = resolvedList.filter((b) => b.valid).map((a) => a.busStop);
            yield cache_1.default.save(exports.getNewRouteKey(payload.user.id), 'busStageList', filteredBusStops);
            return filteredBusStops;
        });
    }
    static coordinatesFromPlusCodes(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const busStop = yield googleMapsHelpers_1.RoutesHelper.getReverseGeocodePayload(payload);
            const { plus_code: { geometry: { location: { lat: latitude, lng: longitude } } } } = busStop;
            const locationGeometry = `${latitude},${longitude}`;
            const address = `${busStop.plus_code.best_street_address}`;
            yield cache_1.default.save(exports.getNewRouteKey(payload.user.id), 'dropOffAddress', { address, latitude, longitude });
            return locationGeometry;
        });
    }
}
exports.default = RouteInputHandlerHelper;
//# sourceMappingURL=RouteInputHandlerHelper.js.map