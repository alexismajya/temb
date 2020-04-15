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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const teamDetails_service_1 = require("../teamDetails/teamDetails.service");
const database_1 = __importStar(require("../../database"));
const engagement_1 = __importDefault(require("../../database/models/engagement"));
const cab_1 = __importDefault(require("../../database/models/cab"));
const address_1 = __importDefault(require("../../database/models/address"));
const user_1 = __importDefault(require("../../database/models/user"));
const base_service_1 = require("../shared/base.service");
class RouteRequestService extends base_service_1.BaseService {
    constructor(model = database_1.default.getRepository(database_1.RouteRequest)) {
        super(model);
        this.defaultInclude = ['opsReviewer', 'manager',
            {
                model: engagement_1.default,
                as: 'engagement',
                include: ['partner', 'fellow'],
            },
            {
                model: address_1.default,
                as: 'busStop',
                include: ['location'],
            },
            {
                model: address_1.default,
                as: 'home',
                include: ['location'],
            },
            {
                model: user_1.default,
                as: 'requester',
            },
        ];
    }
    findByPk(id, withFks = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const include = withFks ? this.defaultInclude : [];
            return yield this.model.findByPk(id, { include });
        });
    }
    createRoute(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.add({
                requesterId: data.requesterId,
                routeImageUrl: data.routeImageUrl,
                managerId: data.managerId,
                busStopId: data.busStopId,
                homeId: data.homeId,
                engagementId: data.engagementId,
                opsComment: data.opsComment,
                managerComment: data.managerComment,
                distance: data.distance,
                busStopDistance: data.busStopDistance,
                status: 'Pending',
            });
        });
    }
    getRouteRequest(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findByPk(id, true);
        });
    }
    update(id, data) {
        const _super = Object.create(null, {
            update: { get: () => super.update }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.update.call(this, id, data);
        });
    }
    getRouteRequestByPk(id, includes) {
        return __awaiter(this, void 0, void 0, function* () {
            const include = includes || this.defaultInclude;
            const routeRequest = yield this.findById(id, include);
            return routeRequest;
        });
    }
    getRouteRequestAndToken(routeRequestId, teamId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [slackBotOauthToken, routeRequest] = yield Promise.all([
                teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken(teamId),
                this.getRouteRequest(routeRequestId),
            ]);
            return { slackBotOauthToken, routeRequest };
        });
    }
    getAllConfirmedRouteRequests(homebaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findAll({
                where: { homebaseId, status: 'Confirmed' },
                include: this.defaultInclude,
            });
        });
    }
    getCabCapacity(regNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const cab = yield cab_1.default.findOne({
                where: { regNumber },
                attributes: ['id', 'capacity'],
            });
            return cab && cab.get() ? cab.get('capacity') : 0;
        });
    }
}
exports.RouteRequestService = RouteRequestService;
const routeRequestService = new RouteRequestService();
exports.default = routeRequestService;
//# sourceMappingURL=route-request.service.js.map