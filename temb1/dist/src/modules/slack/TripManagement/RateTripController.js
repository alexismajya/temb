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
const trip_service_1 = __importDefault(require("../../trips/trip.service"));
const SlackMessageModels_1 = require("../SlackModels/SlackMessageModels");
const batchUseRecord_service_1 = require("../../batchUseRecords/batchUseRecord.service");
const cleanData_1 = __importDefault(require("../../../helpers/cleanData"));
const interactions_1 = __importDefault(require("../../new-slack/trips/user/interactions"));
const user_service_1 = __importDefault(require("../../users/user.service"));
const constants_1 = require("../../../helpers/constants");
const updatePastMessageHelper_1 = __importDefault(require("../../../helpers/slack/updatePastMessageHelper"));
const Notifications_1 = __importDefault(require("../SlackPrompts/Notifications"));
const bugsnagHelper_1 = __importDefault(require("../../../helpers/bugsnagHelper"));
class RateTripController {
    static sendRatingMessage(tripId, prop) {
        return __awaiter(this, void 0, void 0, function* () {
            const attachment = new SlackMessageModels_1.SlackAttachment();
            const buttons = RateTripController.createRatingButtons(tripId);
            attachment.addOptionalProps(prop);
            attachment.addFieldsOrActions('actions', buttons);
            const message = new SlackMessageModels_1.SlackInteractiveMessage(`*Please rate this ${prop.split('_')[1]} on a scale of '1 - 5' :star: *`, [attachment]);
            return message;
        });
    }
    static createRatingButtons(tripId) {
        return [
            new SlackMessageModels_1.SlackButtonAction(1, '1 :disappointed:', tripId, 'danger'),
            new SlackMessageModels_1.SlackButtonAction(2, '2 :slightly_frowning_face:', tripId, 'danger'),
            new SlackMessageModels_1.SlackButtonAction(3, '3 :neutral_face:', tripId, 'default'),
            new SlackMessageModels_1.SlackButtonAction(4, '4 :simple_smile:', tripId),
            new SlackMessageModels_1.SlackButtonAction(5, '5 :star-struck:', tripId)
        ];
    }
    static rate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = cleanData_1.default.trim(data);
                const { actions: [{ name, value }], callback_id } = payload;
                if (callback_id === 'rate_trip') {
                    yield trip_service_1.default.updateRequest(value, { rating: name });
                    const state = {
                        tripId: value,
                        response_url: payload.response_url
                    };
                    yield RateTripController.getAfterRatingAction(payload, state);
                    yield Notifications_1.default.sendOpsPostRatingMessage(payload);
                }
                if (callback_id === 'rate_route') {
                    yield batchUseRecord_service_1.batchUseRecordService.updateBatchUseRecord(value, { rating: name });
                    return new SlackMessageModels_1.SlackInteractiveMessage('Thank you for using Tembea');
                }
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
            }
        });
    }
    static getAfterRatingAction(payload, state) {
        return __awaiter(this, void 0, void 0, function* () {
            const { homebase: { name: homebase } } = yield user_service_1.default.getUserBySlackId(payload.user.id);
            if (homebase === constants_1.HOMEBASE_NAMES.KAMPALA) {
                const message = new SlackMessageModels_1.SlackInteractiveMessage('Thank you for using Tembea');
                yield updatePastMessageHelper_1.default.newUpdateMessage(payload.response_url, message);
                return;
            }
            yield interactions_1.default.sendPriceForm(payload, state);
        });
    }
}
exports.default = RateTripController;
//# sourceMappingURL=RateTripController.js.map