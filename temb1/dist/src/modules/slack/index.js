"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SlackController_1 = __importDefault(require("./SlackController"));
const trip_controller_1 = __importDefault(require("../new-slack/trips/user/trip.controller"));
const SlackInteractionsRouter_1 = __importStar(require("./SlackInteractions/SlackInteractionsRouter"));
const middlewares_1 = __importDefault(require("../../middlewares"));
const GeneralValidator_1 = __importDefault(require("../../middlewares/GeneralValidator"));
const { CleanRequestBody } = middlewares_1.default;
const SlackRouter = express_1.default.Router();
const slackCommandHandler = [
    CleanRequestBody.trimAllInputs,
    SlackController_1.default.handleSlackCommands,
    trip_controller_1.default.launch,
];
SlackRouter.use('/actions', (rq, rs, nx) => SlackInteractionsRouter_1.modalRouter.handle(rq, rs, nx), SlackInteractionsRouter_1.default.expressMiddleware());
SlackRouter.post('/command', ...slackCommandHandler);
SlackRouter.post('/options', SlackController_1.default.handleExternalSelect);
SlackRouter.get('/channels', GeneralValidator_1.default.validateSlackUrl, SlackController_1.default.getChannels);
exports.default = SlackRouter;
//# sourceMappingURL=index.js.map