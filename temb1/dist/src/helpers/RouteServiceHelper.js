"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RouteServiceHelper {
    static isCabFields(predicate) {
        return predicate === 'driverName' || predicate === 'driverPhoneNo' || predicate === 'regNumber';
    }
    static serializeRider(rider) {
        if (!rider)
            return {};
        const { slackId, id, email } = rider;
        return { slackId, id, email };
    }
    static serializeRiders(data) {
        if (!data)
            return {};
        const riders = data.map(RouteServiceHelper.serializeRider);
        const inUse = riders.length;
        return { inUse, riders };
    }
    static serializeRoute(route) {
        if (!route)
            return {};
        const { name, destination: { address: destination } } = route;
        return { name, destination };
    }
    static serializeCabDetails(cabDetails) {
        if (cabDetails) {
            const { driverName, driverPhoneNo, regNumber } = cabDetails;
            return { driverName, driverPhoneNo, regNumber };
        }
        return {};
    }
    static canJoinRoute(route) {
        return route.riders && route.riders.length < route.capacity;
    }
    static serializeRouteBatch(routeData) {
        const { id, status, takeOff, capacity, batch, comments, inUse, imageUrl, routeId, homebase } = routeData;
        return Object.assign(Object.assign(Object.assign({ id,
            status,
            imageUrl,
            takeOff,
            capacity,
            batch,
            comments,
            routeId,
            homebase, inUse: inUse || 0 }, RouteServiceHelper.serializeRoute(routeData.route)), RouteServiceHelper.serializeCabDetails(routeData.cabDetails)), RouteServiceHelper.serializeRiders(routeData.riders));
    }
}
exports.default = RouteServiceHelper;
//# sourceMappingURL=RouteServiceHelper.js.map