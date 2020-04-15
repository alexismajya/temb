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
const teamDetails_service_1 = require("../../teamDetails/teamDetails.service");
const homebase_service_1 = require("../../homebases/homebase.service");
const slack_helpers_1 = __importDefault(require("./slack-helpers"));
class ModalRouter {
    constructor() {
        this.routes = new Map();
    }
    submission(key, handler) {
        this.routes.set(key, handler);
    }
    isModal(payload) {
        return payload.type === 'view_submission';
    }
    handle(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            if (body) {
                const payload = JSON.parse(body.payload);
                const respond = {
                    send: (data) => res.status(200).send(data),
                    update: (view) => res.status(200).send({
                        view,
                        response_action: 'update',
                    }),
                    error: (errors) => res.status(200).send({
                        errors,
                        response_action: 'errors',
                    }),
                    clear: () => res.status(200).send({ response_action: 'clear' }),
                };
                if (!this.isModal(payload)) {
                    return next();
                }
                const [teamDetails, homebase] = yield Promise.all([
                    teamDetails_service_1.teamDetailsService.getTeamDetails(payload.team.id),
                    homebase_service_1.homebaseService.getHomeBaseBySlackId(payload.user.id),
                ]);
                switch (payload.type) {
                    case 'view_submission':
                        return this.handleViewSubmission(payload, respond, {
                            homebase,
                            botToken: teamDetails.botToken,
                        });
                    default:
                        next();
                }
            }
        });
    }
    handleViewSubmission(payload, response, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const handler = this.routes.get(payload.view.callback_id);
            const submission = slack_helpers_1.default.modalParser(payload.view.state.values);
            if (handler)
                return handler(payload, submission, response, context);
        });
    }
}
exports.default = ModalRouter;
//# sourceMappingURL=modal.router.js.map