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
const constants_1 = require("../../helpers/constants");
const responseHelper_1 = __importDefault(require("../../helpers/responseHelper"));
const trip_service_1 = __importDefault(require("./trip.service"));
const teamDetails_service_1 = require("../teamDetails/teamDetails.service");
const user_service_1 = __importDefault(require("../users/user.service"));
const RouteUseRecordService_1 = __importDefault(require("../../services/RouteUseRecordService"));
const TripActionsController_1 = __importDefault(require("../slack/TripManagement/TripActionsController"));
const errorHandler_1 = __importDefault(require("../../helpers/errorHandler"));
const TripHelper_1 = __importDefault(require("../../helpers/TripHelper"));
const cab_service_1 = require("../cabs/cab.service");
const driver_service_1 = require("../drivers/driver.service");
const homebase_service_1 = require("../homebases/homebase.service");
class TripsController {
    static getTrips(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { query: { page, size } } = req;
                const { headers: { homebaseid } } = req;
                page = page || 1;
                size = size || constants_1.DEFAULT_SIZE;
                const query = TripsController.getRequestQuery(req);
                const where = trip_service_1.default.sequelizeWhereClauseOption(query);
                const pageable = { page, size };
                const { totalPages, trips, page: pgNo, totalItems, itemsPerPage } = yield trip_service_1.default.getTrips(pageable, where, homebaseid);
                const message = `${pgNo} of ${totalPages} page(s).`;
                const pageData = {
                    pageMeta: {
                        totalPages,
                        page: pgNo,
                        totalResults: totalItems,
                        pageSize: itemsPerPage
                    },
                    trips
                };
                return responseHelper_1.default.sendResponse(res, 200, true, message, pageData);
            }
            catch (error) {
                errorHandler_1.default.sendErrorResponse(error, res);
            }
        });
    }
    static getRequestQuery(req) {
        const departureTime = TripHelper_1.default.cleanDateQueryParam(req.query, 'departureTime');
        const requestedOn = TripHelper_1.default.cleanDateQueryParam(req.query, 'requestedOn');
        return Object.assign(Object.assign({}, req.query), { requestedOn,
            departureTime });
    }
    static appendPropsToPayload(payload, req) {
        const { body: { comment, isAssignProvider }, query: { action } } = req;
        const derivedPayload = Object.assign({}, payload);
        if (action === 'confirm') {
            derivedPayload.submission = TripsController.getConfirmationSubmission(req.body);
            const state = JSON.parse(derivedPayload.state);
            state.isAssignProvider = isAssignProvider;
            derivedPayload.state = JSON.stringify(state);
        }
        if (action === 'decline') {
            derivedPayload.submission = { opsDeclineComment: comment };
        }
        return derivedPayload;
    }
    static updateTrip(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { params: { tripId }, query: { action }, body: { slackUrl }, currentUser } = req;
            const payload = yield TripsController.getCommonPayloadParam(currentUser, slackUrl, tripId);
            const actionSuccessMessage = action === 'confirm' ? 'trip confirmed' : 'trip declined';
            const derivedPayload = TripsController.appendPropsToPayload(payload, req);
            const result = yield TripActionsController_1.default.changeTripStatus(derivedPayload);
            const responseMessage = result === 'success' ? actionSuccessMessage : result.text;
            return res.status(200).json({ success: result === 'success', message: responseMessage });
        });
    }
    static getSlackIdFromReq(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userInfo: { email } } = user;
            const { slackId: userId } = yield user_service_1.default.getUserByEmail(email);
            return userId;
        });
    }
    static getCommonPayloadParam(user, slackUrl, tripId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield TripsController.getSlackIdFromReq(user);
            const { teamId } = yield teamDetails_service_1.teamDetailsService.getTeamDetailsByTeamUrl(slackUrl);
            const trip = yield trip_service_1.default.getById(tripId);
            const { channel } = yield homebase_service_1.homebaseService.getById(trip.homebaseId);
            const state = JSON.stringify({
                trip: tripId,
                tripId,
                actionTs: +new Date()
            });
            const payload = {
                submission: {},
                user: { id: userId },
                team: { id: teamId },
                channel: { id: channel },
                state
            };
            return payload;
        });
    }
    static getConfirmationSubmission(reqBody) {
        const { driverName, driverPhoneNo, regNumber, comment, providerId } = reqBody;
        return {
            confirmationComment: comment,
            driverName,
            driverPhoneNo,
            regNumber,
            providerId
        };
    }
    static getTravelTrips(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { startDate, endDate, departmentList, }, headers: { homebaseid } } = req;
            const travelTrips = yield trip_service_1.default.getCompletedTravelTrips(startDate, endDate, departmentList, homebaseid);
            const result = travelTrips.map((trip) => {
                const tripObject = trip;
                tripObject.averageRating = parseFloat(trip.averageRating).toFixed(2);
                return tripObject;
            });
            const { finalCost, finalAverageRating, count } = yield TripHelper_1.default.calculateSums(result);
            const data = {
                trips: result, finalCost, finalAverageRating, count
            };
            return responseHelper_1.default.sendResponse(res, 200, true, 'Request was successful', data);
        });
    }
    static getRouteTrips(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { query: { page = 1, size = 10 }, headers: { homebaseid } } = req;
            try {
                let routeTrips = yield RouteUseRecordService_1.default.getRouteTripRecords({ page, size }, homebaseid);
                if (!routeTrips.data) {
                    return responseHelper_1.default.sendResponse(res, 200, true, 'No route trips available yet', []);
                }
                const { pageMeta, data } = routeTrips;
                routeTrips = yield RouteUseRecordService_1.default.getAdditionalInfo(data);
                if (routeTrips.length === 0) {
                    return responseHelper_1.default.sendResponse(res, 200, true, 'No route trips available yet', []);
                }
                const result = { pageMeta: Object.assign({}, pageMeta), data: routeTrips };
                return responseHelper_1.default
                    .sendResponse(res, 200, true, 'Route trips retrieved successfully', result);
            }
            catch (error) {
                errorHandler_1.default.sendErrorResponse(error, res);
            }
        });
    }
    static providerConfirm(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { teamId, providerId, tripId, vehicleRegNo, driverName, driverPhoneNo, vehicleModel, color, } = req.body;
                const error = yield TripHelper_1.default.checkExistence(teamId, providerId, tripId);
                if (error)
                    return responseHelper_1.default.sendResponse(res, 404, false, { error: `${error}` });
                const driver = yield driver_service_1.driverService.create(driverName, driverPhoneNo, providerId);
                const { cab } = yield cab_service_1.cabService.findOrCreateCab(vehicleRegNo, null, vehicleModel, providerId, color);
                const payload = {
                    driverName: driver.driverName,
                    driverPhoneNo: driver.driverPhoneNo,
                    vehicleModel: cab.model,
                    vehicleRegNo: cab.regNumber,
                    vehicleColor: cab.color,
                };
                yield trip_service_1.default.completeCabAndDriverAssignment({
                    tripId, updateData: { cabId: cab.id, driverId: driver.id }, teamId
                });
                return responseHelper_1.default.sendResponse(res, 201, true, { message: 'Confirmation received', payload });
            }
            catch (error) {
                return responseHelper_1.default.sendResponse(res, 500, false, {
                    error: 'Failed to complete trip confirmation, Please try again'
                });
            }
        });
    }
}
exports.default = TripsController;
//# sourceMappingURL=TripsController.js.map