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
const base_service_1 = require("../shared/base.service");
const database_1 = __importDefault(require("../../database"));
const join_request_1 = __importDefault(require("../../database/models/join-request"));
const bugsnagHelper_1 = __importDefault(require("../../helpers/bugsnagHelper"));
const { models: { Engagement, RouteBatch, Route, }, } = database_1.default;
class JoinRouteRequestService extends base_service_1.BaseService {
    constructor(model = database_1.default.getRepository(join_request_1.default)) {
        super(model);
        this.defaultInclude = ['manager',
            {
                model: Engagement,
                as: 'engagement',
                include: ['partner', 'fellow'],
            },
            {
                model: RouteBatch,
                as: 'routeBatch',
                include: ['riders', { model: Route, as: 'route', include: ['destination'] }],
            },
        ];
    }
    createJoinRouteRequest(engagementId, managerId, routeBatchId, managerComment = '') {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.model.create({
                    engagementId,
                    managerId,
                    routeBatchId,
                    managerComment,
                    status: 'Pending',
                });
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
            }
        });
    }
    getJoinRouteRequest(id, include = this.defaultInclude) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findById(id, include);
        });
    }
    updateJoinRouteRequest(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const routeJoinRequest = this.getJoinRouteRequest(id);
            if (routeJoinRequest) {
                return this.update(id, data);
            }
            return {
                message: 'Join route request not found',
            };
        });
    }
}
exports.joinRouteRequestService = new JoinRouteRequestService();
exports.default = JoinRouteRequestService;
//# sourceMappingURL=joinRouteRequest.service.js.map