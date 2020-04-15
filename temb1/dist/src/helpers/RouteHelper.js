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
const address_service_1 = require("../modules/addresses/address.service");
const location_service_1 = __importDefault(require("../modules/locations/location.service"));
const route_service_1 = require("../modules/routes/route.service");
const cab_service_1 = require("../modules/cabs/cab.service");
const provider_service_1 = require("../modules/providers/provider.service");
const data_1 = require("../utils/data");
const route_request_service_1 = __importDefault(require("../modules/routes/route-request.service"));
const routeBatch_service_1 = require("../modules/routeBatches/routeBatch.service");
class RouteHelper {
    static checkRequestProps(createRouteRequest) {
        const receivedProps = Object.keys(createRouteRequest);
        return data_1.expectedCreateRouteObject.reduce((acc, item) => {
            if (!receivedProps.includes(item)) {
                acc = `${acc}, ${item}`;
            }
            return acc;
        }, '');
    }
    static findPercentageUsage(record, allUsageRecords, dormantRouteBatches) {
        const usageRecords = Object.values(record);
        const confirmedRecords = usageRecords
            .filter((confirmed) => confirmed.userAttendStatus === 'Confirmed');
        const batchUsage = {};
        const { RouteBatchName, Route } = record[0];
        batchUsage.Route = Route;
        batchUsage.RouteBatch = RouteBatchName;
        batchUsage.users = usageRecords.length;
        if (!confirmedRecords.length) {
            batchUsage.percentageUsage = 0;
            dormantRouteBatches.push(batchUsage);
            return dormantRouteBatches;
        }
        const percentageUsage = (confirmedRecords.length / usageRecords.length) * 100;
        batchUsage.percentageUsage = Math.round(percentageUsage);
        allUsageRecords.push(batchUsage);
        return allUsageRecords;
    }
    static reducerHelper(prev, current, attribute, status) {
        if (status === 'min') {
            return prev[attribute] < current[attribute] ? prev : current;
        }
        return prev[attribute] > current[attribute] ? prev : current;
    }
    static checkNumberValues(value, field) {
        const isInter = Number.isInteger(parseInt(value, 10));
        const isGreaterThanZero = parseInt(value, 10) > 0;
        if (isInter && isGreaterThanZero)
            return [];
        return [`${field} must be a non-zero integer greater than zero`];
    }
    static checkThatAddressAlreadyExists(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingAddress = yield address_service_1.addressService.findAddress(address);
            return !!existingAddress;
        });
    }
    static checkThatLocationAlreadyExists(coordinates) {
        return __awaiter(this, void 0, void 0, function* () {
            let location;
            if (coordinates) {
                const { lat: latitude, lng: longitude } = coordinates;
                location = yield location_service_1.default.findLocation(longitude, latitude);
            }
            return !!location;
        });
    }
    static checkThatVehicleRegNumberExists(vehicleRegNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const cab = yield cab_service_1.cabService.findByRegNumber(vehicleRegNumber);
            return [!!cab, cab];
        });
    }
    static checkThatRouteNameExists(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const route = yield route_service_1.routeService.getRouteByName(name);
            return [!!route, route];
        });
    }
    static checkThatProviderIdExists(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = yield provider_service_1.providerService.getProviderById(providerId);
            return [!!provider];
        });
    }
    static createNewRouteWithBatch(data, botToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const { routeName, destination: { address, location, coordinates }, takeOffTime, capacity, providerId, imageUrl } = data;
            const [latitude, longitude] = location
                ? [location.latitude, location.longitude]
                : [coordinates.lat, coordinates.lng];
            const destinationAddress = yield address_service_1.addressService.createNewAddress(longitude, latitude, address);
            const routeObject = {
                name: routeName, imageUrl, destinationId: destinationAddress.id
            };
            const { route } = yield route_service_1.routeService.createRoute(routeObject);
            const batchData = {
                capacity,
                takeOff: takeOffTime,
                providerId,
                routeId: route.id
            };
            const batch = yield route_service_1.routeService.createRouteBatch(batchData, botToken, true);
            return { route, batch };
        });
    }
    static createNewRouteBatchFromSlack(submission, routeRequestId, botToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const routeRequest = yield route_request_service_1.default.findByPk(routeRequestId, true);
            const { routeName, takeOffTime, routeCapacity: capacity, providerId } = submission;
            const { routeImageUrl: imageUrl, busStop: destination } = routeRequest;
            const data = {
                routeName,
                destination,
                takeOffTime,
                capacity,
                providerId,
                imageUrl
            };
            return RouteHelper.createNewRouteWithBatch(data, botToken);
        });
    }
    static duplicateRouteBatch(id, botToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const routeBatch = yield routeBatch_service_1.routeBatchService.getRouteBatchByPk(id, true);
            if (!routeBatch) {
                return 'Route does not exist';
            }
            const batch = yield RouteHelper.cloneBatchDetails(routeBatch, botToken);
            return { batch, routeName: routeBatch.route.name };
        });
    }
    static cloneBatchDetails(routeBatch, botToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const batch = yield route_service_1.routeService.createRouteBatch(routeBatch, botToken, false);
            return batch;
        });
    }
    static updateRouteRequest(routeId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield route_request_service_1.default.update(routeId, data);
            const updatedRequest = yield route_request_service_1.default.findByPk(routeId, true);
            return updatedRequest;
        });
    }
    static validateRouteStatus(routeRequest) {
        const { status } = routeRequest;
        if (status === 'Approved' || status === 'Declined') {
            return `This request has already been ${status.toLowerCase()}`;
        }
        if (status !== 'Confirmed') {
            return 'This request needs to be confirmed by the manager first';
        }
        return true;
    }
    static batchObject(routeBatch, batch) {
        const { takeOff, capacity, status } = routeBatch;
        const data = {
            takeOff,
            capacity,
            status,
            batch
        };
        return data;
    }
    static pageDataObject(result) {
        const pageData = {
            pageMeta: {
                totalPages: result.totalPages,
                page: result.pageNo,
                totalResults: result.totalItems.length,
                pageSize: result.itemsPerPage
            },
            routes: result.routes
        };
        return pageData;
    }
    static mostUsedRoute(values) {
        let repetionTimes = 0;
        let numberOfTimes = null;
        let repetitionElement;
        for (let i = 0; i < values.length; i++) {
            for (let j = 0; j < values.length; j++) {
                if (values[i] === values[j]) {
                    repetionTimes++;
                    if (numberOfTimes < repetionTimes) {
                        numberOfTimes = repetionTimes;
                        repetitionElement = values[i];
                    }
                }
            }
            repetionTimes = 0;
        }
        return {
            mostUsedRoute: repetitionElement,
            numberOfTimes
        };
    }
    static leastUsedRoute(values) {
        const result = [...values.reduce((acc, current) => acc.set(current, (acc.get(current) || 0) + 1), new Map())]
            .reduce((acc, curr) => (curr[1] < acc[1] ? curr : acc));
        return {
            leastUsedRoute: result[0],
            numberOfLeastUsedTime: result[1]
        };
    }
    static mostLeastUsedRoutePercentage(NumberOfTimes, rowCount) {
        const divide = Number(NumberOfTimes) / Number(rowCount);
        const percentage = divide * 100;
        const verifyNumber = isNaN(percentage) ? 'N/A' : percentage;
        return (Math.round(verifyNumber * 100) / 100).toFixed(1);
    }
}
exports.default = RouteHelper;
//# sourceMappingURL=RouteHelper.js.map