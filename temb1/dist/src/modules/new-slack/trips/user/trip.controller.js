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
const trip_helpers_1 = __importDefault(require("./trip.helpers"));
const actions_1 = __importDefault(require("../travel/actions"));
const slack_helpers_1 = __importDefault(require("../../helpers/slack-helpers"));
const blocks_1 = __importDefault(require("./blocks"));
const actions_2 = __importDefault(require("./actions"));
class TripController {
    static launch(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { user_id: slackId } } = req;
            const message = yield trip_helpers_1.default.getWelcomeMessage(slackId);
            return res.status(200).json(message);
        });
    }
    static changeLocation(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            let message;
            let navBlock;
            const { actions: [{ action_id }] } = payload;
            if (action_id === actions_1.default.changeLocation) {
                navBlock = slack_helpers_1.default.getNavBlock(blocks_1.default.navBlock, actions_2.default.back, 'back_to_travel_launch');
                message = yield trip_helpers_1.default.changeLocation(payload, navBlock);
            }
            else {
                message = yield trip_helpers_1.default.changeLocation(payload);
            }
            respond(message);
        });
    }
    static selectLocation(payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = yield trip_helpers_1.default.selectLocation(payload);
            respond(message);
        });
    }
}
exports.default = TripController;
//# sourceMappingURL=trip.controller.js.map