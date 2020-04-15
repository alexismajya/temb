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
const errorHandler_1 = __importDefault(require("../../helpers/errorHandler"));
const bugsnagHelper_1 = __importDefault(require("../../helpers/bugsnagHelper"));
const constants_1 = require("../../helpers/constants");
const responseHelper_1 = __importDefault(require("../../helpers/responseHelper"));
const route_service_1 = require("./route.service");
const routeBatch_service_1 = require("../routeBatches/routeBatch.service");
const route_statistics_service_1 = require("./route-statistics.service");
const sequelizePaginationHelper_1 = __importDefault(require("../../helpers/sequelizePaginationHelper"));
const googleMapsHelpers_1 = require("../../helpers/googleMaps/googleMapsHelpers");
const GoogleMapsPlaceDetails_1 = __importDefault(require("../../services/googleMaps/GoogleMapsPlaceDetails"));
const cache_1 = __importDefault(require("../shared/cache"));
const slackEvents_1 = require("../slack/events/slackEvents");
const SlackMessageModels_1 = require("../slack/SlackModels/SlackMessageModels");
const address_service_1 = require("../addresses/address.service");
const route_request_service_1 = __importDefault(require("./route-request.service"));
const user_service_1 = __importDefault(require("../users/user.service"));
const RouteHelper_1 = __importDefault(require("../../helpers/RouteHelper"));
const RouteNotifications_1 = __importDefault(require("../slack/SlackPrompts/notifications/RouteNotifications"));
const teamDetails_service_1 = require("../teamDetails/teamDetails.service");
const events_1 = __importDefault(require("../slack/events"));
const apiVersionHelper_1 = __importDefault(require("../../helpers/apiVersionHelper"));
const homebase_service_1 = require("../homebases/homebase.service");
class RoutesController {
    static getRoutes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { page, size, sort, name } = req.query;
                page = page || 1;
                size = size || constants_1.DEFAULT_SIZE;
                name = name || null;
                const { query: { status }, currentUser: { userInfo } } = req;
                const { homebaseId } = yield user_service_1.default.getUserByEmail(userInfo.email);
                sort = sequelizePaginationHelper_1.default.deserializeSort(sort || 'name,asc,id,asc');
                const pageable = { page, size, sort };
                const where = { name, status };
                const result = apiVersionHelper_1.default.getApiVersion(req) === 'v1'
                    ? yield routeBatch_service_1.routeBatchService.getRoutes(pageable, where, homebaseId)
                    : yield routeBatch_service_1.routeBatchService.getRoutes(pageable, where, homebaseId, true);
                const message = `${result.pageNo} of ${result.totalPages} page(s).`;
                return responseHelper_1.default.sendResponse(res, 200, true, message, result);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                errorHandler_1.default.sendErrorResponse(error, res);
            }
        });
    }
    static createRoute(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let message;
            let batch;
            let routeName;
            const { query: { action, batchId }, body } = req;
            try {
                const { botToken } = yield teamDetails_service_1.teamDetailsService.getTeamDetailsByTeamUrl(body.teamUrl);
                if (action === 'duplicate' && batchId) {
                    ({ batch, routeName } = yield RouteHelper_1.default.duplicateRouteBatch(batchId, botToken));
                    message = `Successfully duplicated ${routeName} route`;
                }
                else if (!batchId) {
                    const result = yield RouteHelper_1.default.createNewRouteWithBatch(body, botToken);
                    ({ batch } = result);
                    const { provider } = body;
                    events_1.default.raise(slackEvents_1.slackEventNames.SEND_PROVIDER_CREATED_ROUTE_REQUEST, batch, provider.id, botToken);
                    message = 'Route created successfully';
                }
                return responseHelper_1.default.sendResponse(res, 200, true, message, batch);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                errorHandler_1.default.sendErrorResponse(error, res);
            }
        });
    }
    static saveDestination(destinationCoordinates) {
        return __awaiter(this, void 0, void 0, function* () {
            const [lat, long] = destinationCoordinates.split(',');
            const address = yield address_service_1.addressService.findAddressByCoordinates(long, lat);
            if (address) {
                return address;
            }
            const place = yield googleMapsHelpers_1.RoutesHelper.getPlaceInfo('coordinates', destinationCoordinates);
            if (!place) {
                errorHandler_1.default.throwErrorIfNull(null, 'Invalid Coordinates', 400);
            }
            const { geometry: { location: { lat: latitude, lng: longitude } } } = place;
            const placeDetails = yield GoogleMapsPlaceDetails_1.default.getPlaceDetails(place.place_id);
            const newAddress = `${placeDetails.result.name}, ${placeDetails.result.formatted_address}`;
            return address_service_1.addressService.createNewAddress(longitude, latitude, newAddress);
        });
    }
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { currentUser: { userInfo } } = req;
                const { homebaseId } = yield user_service_1.default.getUserByEmail(userInfo.email);
                const routes = yield route_request_service_1.default.getAllConfirmedRouteRequests(homebaseId);
                return res.status(200).json({ routes });
            }
            catch (e) {
                return res.status(500).json({ message: 'An error has occurred', success: false });
            }
        });
    }
    static getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const route = yield route_service_1.routeService.getRouteById(req.params.id, false);
                if (!route)
                    throw new Error('route not found');
                return res.status(200).json({
                    message: 'Success',
                    route
                });
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                return res.status(404).json({ success: false, message: 'Route not found' });
            }
        });
    }
    static updateRouteBatch(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body, params: { routeId: id } } = req;
                const result = yield routeBatch_service_1.routeBatchService.updateRouteBatch(+id, body);
                const routeBatch = yield routeBatch_service_1.routeBatchService.getRouteBatchByPk(result.id, true);
                const slackTeamUrl = body.teamUrl.trim();
                events_1.default.raise(slackEvents_1.slackEventNames.NOTIFY_ROUTE_RIDERS, slackTeamUrl, routeBatch);
                const message = 'Route batch successfully updated';
                return responseHelper_1.default.sendResponse(res, 200, true, message, routeBatch);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                errorHandler_1.default.sendErrorResponse(error, res);
            }
        });
    }
    static updateRouteRequestStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { params: { requestId }, body, currentUser: { userInfo: { email } } } = req;
                const routeRequest = yield route_request_service_1.default.getRouteRequestByPk(requestId);
                RoutesController.checkCurrentApprovalStatus(routeRequest, res);
                const opsReviewer = yield user_service_1.default.getUserByEmail(email);
                const updatedRequest = yield RouteHelper_1.default.updateRouteRequest(routeRequest.id, {
                    status: body.newOpsStatus === 'approve' ? 'Approved' : 'Declined',
                    opsComment: body.comment,
                    opsReviewerId: opsReviewer.id
                });
                const submission = RoutesController.getSubmissionDetails(body, routeRequest);
                yield RoutesController.completeRouteApproval(updatedRequest, submission, body.teamUrl, opsReviewer.slackId);
                return responseHelper_1.default.sendResponse(res, 201, true, 'This route request has been updated');
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                errorHandler_1.default.sendErrorResponse(error, res);
            }
        });
    }
    static checkCurrentApprovalStatus(routeRequest, res) {
        if (!routeRequest) {
            return responseHelper_1.default.sendResponse(res, 404, false, 'Route request not found.');
        }
        const checkStatus = RouteHelper_1.default.validateRouteStatus(routeRequest);
        if (checkStatus !== true) {
            return responseHelper_1.default.sendResponse(res, 409, false, checkStatus);
        }
    }
    static getSubmissionDetails(body, updatedRequest) {
        return {
            routeName: body.routeName,
            destination: updatedRequest.busStop,
            takeOffTime: body.takeOff,
            teamUrl: body.teamUrl,
            routeCapacity: null,
            providerId: 1,
            imageUrl: updatedRequest.routeImageUrl
        };
    }
    static completeRouteApproval(updatedRequest, submission, teamUrl, opsSlackId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { botToken } = yield teamDetails_service_1.teamDetailsService.getTeamDetailsByTeamUrl(teamUrl);
            const { channel: opsChannelId } = yield homebase_service_1.homebaseService.getHomeBaseBySlackId(opsSlackId);
            const { timeStamp } = yield cache_1.default.fetch(`RouteRequestTimeStamp_${updatedRequest.id}`);
            const additionalData = {
                channelId: opsChannelId,
                opsSlackId,
                timeStamp,
                submission,
                botToken
            };
            if (updatedRequest.status === 'Approved') {
                const batch = yield RouteHelper_1.default.createNewRouteWithBatch(submission);
                events_1.default.raise(slackEvents_1.slackEventNames.COMPLETE_ROUTE_APPROVAL, updatedRequest, batch, additionalData);
                return;
            }
            events_1.default.raise(slackEvents_1.slackEventNames.OPERATIONS_DECLINE_ROUTE_REQUEST, updatedRequest, botToken, opsChannelId, timeStamp, opsSlackId, true);
        });
    }
    static deleteRouteBatch(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let message;
            try {
                const { params: { routeBatchId }, body: { teamUrl } } = req;
                const slackTeamUrl = teamUrl.trim();
                const routeBatch = yield routeBatch_service_1.routeBatchService.getRouteBatchByPk(routeBatchId, true);
                if (!routeBatch) {
                    message = 'route batch not found';
                    errorHandler_1.default.throwErrorIfNull(routeBatch, message);
                }
                const result = yield routeBatch_service_1.routeBatchService.deleteRouteBatch(routeBatchId);
                if (result > 0) {
                    routeBatch.deleted = true;
                    yield events_1.default.raise(slackEvents_1.slackEventNames.NOTIFY_ROUTE_RIDERS, slackTeamUrl, routeBatch);
                    message = 'route batch deleted successfully';
                    return responseHelper_1.default.sendResponse(res, 200, true, message);
                }
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                return errorHandler_1.default.sendErrorResponse(error, res);
            }
        });
    }
    static deleteFellowFromRoute(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { params: { userId }, body: { teamUrl } } = req;
                let message = "user doesn't belong to this route";
                const { routeBatchId, slackId } = yield user_service_1.default.getUserById(userId);
                if (routeBatchId && slackId) {
                    yield user_service_1.default.updateUser(userId, { routeBatchId: null });
                    const { botToken: teamBotOauthToken } = yield teamDetails_service_1.teamDetailsService.getTeamDetailsByTeamUrl(teamUrl);
                    const { routeId } = yield routeBatch_service_1.routeBatchService.getRouteBatchByPk(routeBatchId, false);
                    const { name } = yield route_service_1.routeService.getRouteById(routeId, false);
                    const text = '*:information_source: Reach out to Ops department for any questions*';
                    const slackMessage = new SlackMessageModels_1.SlackInteractiveMessage(`*Hey <@${slackId}>, You've been removed from \`${name}\` route.* \n ${text}.`);
                    yield RouteNotifications_1.default.sendNotificationToRider(slackMessage, slackId, teamBotOauthToken);
                    message = 'engineer successfully removed from the route';
                }
                return responseHelper_1.default.sendResponse(res, 200, true, message);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                return errorHandler_1.default.sendErrorResponse(error, res);
            }
        });
    }
    static getRouteStatistics(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { query: { from, to }, headers: { homebaseid } } = req;
            try {
                const result = yield route_statistics_service_1.routeStatistics.getTopAndLeastFrequentRiders(from, to, homebaseid);
                return responseHelper_1.default.sendResponse(res, 200, true, 'data retrieved successfully', result);
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                return errorHandler_1.default.sendErrorResponse(error, res);
            }
        });
    }
}
exports.default = RoutesController;
//# sourceMappingURL=RouteController.js.map