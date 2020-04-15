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
const SlackMessageModels_1 = require("../SlackModels/SlackMessageModels");
const index_1 = __importDefault(require("../SlackInteractions/index"));
const bugsnagHelper_1 = __importDefault(require("../../../helpers/bugsnagHelper"));
class TripCabController {
    static sendCreateCabAttachment(payload, callbackId, routeRequestData) {
        try {
            const state = JSON.parse(payload.state);
            state.confirmationComment = payload.submission.confirmationComment;
            state.routeRequestData = routeRequestData;
            const attachment = new SlackMessageModels_1.SlackAttachment();
            attachment.addFieldsOrActions('actions', [
                new SlackMessageModels_1.SlackButtonAction('confirmTrip', 'Proceed', JSON.stringify(state))
            ]);
            attachment.addOptionalProps(callbackId);
            const result = new SlackMessageModels_1.SlackInteractiveMessage('*Proceed to Create New Cab*', [attachment]);
            return result;
        }
        catch (error) {
            bugsnagHelper_1.default.log(error);
        }
    }
    static handleSelectProviderDialogSubmission(data, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            const modified = Object.assign({}, data);
            modified.submission.providerId = parseInt(data.submission.provider, 10);
            yield index_1.default.handleTripActions(modified, respond);
        });
    }
}
exports.default = TripCabController;
//# sourceMappingURL=TripCabController.js.map