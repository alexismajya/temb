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
const teamDetails_service_1 = require("../../../teamDetails/teamDetails.service");
const slack_helpers_1 = __importDefault(require("../../helpers/slack-helpers"));
const dateHelper_1 = __importDefault(require("../../../../helpers/dateHelper"));
const schemas_1 = require("../schemas");
class Validators {
    static validatePickUpSubmission(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { submission, user, team } = payload;
                const botToken = yield teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken(team.id);
                const userInfo = yield slack_helpers_1.default.getUserInfo(user.id, botToken);
                submission.dateTime = dateHelper_1.default.transformDate(submission.dateTime, userInfo.tz);
                return slack_helpers_1.default.dialogValidator(submission, schemas_1.getTripPickupSchema(userInfo.tz));
            }
            catch (err) {
                return err;
            }
        });
    }
}
exports.default = Validators;
//# sourceMappingURL=validators.js.map