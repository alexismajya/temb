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
const seeAvailableRoute_helpers_1 = __importDefault(require("./seeAvailableRoute.helpers"));
const homebase_service_1 = require("../../../homebases/homebase.service");
const routeBatch_service_1 = require("../../../routeBatches/routeBatch.service");
'../../../slack/RouteManagement/JoinRoute/JoinRouteNotifications';
const updatePastMessageHelper_1 = __importDefault(require("../../../../helpers/slack/updatePastMessageHelper"));
const pagination_helpers_1 = __importDefault(require("../../helpers/pagination-helpers"));
class SeeAvailableRouteController {
    static seeAvailableRoutes(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = { status: 'Active' };
            const message = yield SeeAvailableRouteController.getAllRoutes(payload, where);
            respond(message);
        });
    }
    static getAllRoutes(payload, where) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = pagination_helpers_1.default.getPageNumber(payload);
            const homebase = yield homebase_service_1.homebaseService.getHomeBaseBySlackId(payload.user.id);
            const result = yield routeBatch_service_1.routeBatchService.getPagedAvailableRouteBatches(homebase.id, page, where);
            const message = yield seeAvailableRoute_helpers_1.default.getAvailableRoutesBlockMessage(result);
            return message;
        });
    }
    static searchRoute(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { response_url: state } = payload;
            yield seeAvailableRoute_helpers_1.default.popModalForSeachRoute(payload, state);
        });
    }
    static handleSearchRoute(payload, submission, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const where = { status: 'Active', name: submission.routeName };
                const message = yield SeeAvailableRouteController.getAllRoutes(payload, where);
                respond.clear();
                const url = JSON.parse(payload.view.private_metadata);
                yield updatePastMessageHelper_1.default.sendMessage(url, message);
            }
            catch (error) {
                respond.error(error.errors);
            }
        });
    }
    static skipPage(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { response_url: state } = payload;
            yield seeAvailableRoute_helpers_1.default.popModalForSkipPage(payload, state);
        });
    }
    static handleSkipPage(payload, submission, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = {
                    team: { id: payload.team.id, domain: payload.team.domain },
                    user: { id: payload.user.id, name: payload.user.name, team_id: payload.team.id },
                    actions: [
                        {
                            action_id: `user_route_page_${submission.pageNumber}`,
                            block_id: 'user_route_pagination',
                            value: `availableRoutes_page_${submission.pageNumber}`,
                        },
                    ],
                };
                respond.clear();
                const where = { status: 'Active' };
                const message = yield SeeAvailableRouteController.getAllRoutes(data, where);
                const url = JSON.parse(payload.view.private_metadata);
                yield updatePastMessageHelper_1.default.sendMessage(url, message);
            }
            catch (error) {
                respond.error(error.errors);
            }
        });
    }
}
exports.default = SeeAvailableRouteController;
//# sourceMappingURL=seeAvailableRoute.controller.js.map