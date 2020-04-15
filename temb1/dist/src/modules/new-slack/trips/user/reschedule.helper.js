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
const moment_1 = __importDefault(require("moment"));
const trip_service_1 = __importDefault(require("../../../trips/trip.service"));
const trip_request_1 = require("../../../../database/models/trip-request");
const teamDetails_service_1 = require("../../../teamDetails/teamDetails.service");
const SlackViews_1 = __importDefault(require("../../extensions/SlackViews"));
const slack_block_models_1 = require("../../models/slack-block-models");
const actions_1 = __importDefault(require("./actions"));
const slack_helpers_1 = __importDefault(require("../../../new-slack/helpers/slack-helpers"));
const dateHelper_1 = __importDefault(require("../../../../helpers/dateHelper"));
const app_event_service_1 = __importDefault(require("../../../events/app-event.service"));
const trip_events_contants_1 = require("../../../events/trip-events.contants");
const InteractivePromptSlackHelper_1 = __importDefault(require("../../../slack/helpers/slackHelpers/InteractivePromptSlackHelper"));
const updatePastMessageHelper_1 = __importDefault(require("../../../../helpers/slack/updatePastMessageHelper"));
const bugsnagHelper_1 = __importDefault(require("../../../../helpers/bugsnagHelper"));
class RescheduleHelper {
    static completeReschedule(payload, data, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user: { id: slackUserId }, view: { private_metadata } } = payload;
            const { origin, tripId } = JSON.parse(private_metadata);
            const slackInfo = yield slack_helpers_1.default.getUserInfo(slackUserId, context.botToken);
            const tripState = yield slack_helpers_1.default.getTripState(tripId);
            if (tripState.currentState === trip_request_1.TripStatus.pending) {
                const departureTime = dateHelper_1.default.mergeDateAndTime(data, slackInfo.tz);
                yield trip_service_1.default.updateRequest(tripId, { departureTime });
                app_event_service_1.default.broadcast({
                    name: trip_events_contants_1.tripEvents.rescheduled,
                    data: {
                        data: {
                            id: tripId,
                        },
                        botToken: context.botToken,
                    },
                });
                const respond = (data) => updatePastMessageHelper_1.default.sendMessage(origin, data);
                yield InteractivePromptSlackHelper_1.default.sendCompletionResponse(respond, tripId, null, true);
            }
        });
    }
    static isRescheduleTimeOut(time) {
        return moment_1.default(time).diff(moment_1.default(), 'minute') > 30;
    }
    static sendTripRescheduleModal(payload, requestId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tripRequest = yield trip_service_1.default.getById(requestId);
            const tripState = yield slack_helpers_1.default.getTripState(requestId);
            const timedOut = RescheduleHelper.isRescheduleTimeOut(tripRequest.departureTime);
            if (tripState.currentState === trip_request_1.TripStatus.pending) {
                RescheduleHelper.sendRescheduleModal(payload, requestId);
                return null;
            }
            const message = timedOut
                ? RescheduleHelper.getRescheduleStatusMessage(tripState)
                : RescheduleHelper.getRescheduleTimedOutMessage();
            return message;
        });
    }
    static getRescheduleTimedOutMessage() {
        return new slack_block_models_1.MarkdownText('Sorry! This trip is close to take-off and cannot be rescheduled but'
            + ' cancelled.');
    }
    static getRescheduleStatusMessage(tripState) {
        return tripState.currentState === trip_request_1.TripStatus.cancelled
            ? new slack_block_models_1.MarkdownText('Sorry! This trip cannot be rescheduled as it was recently'
                + ' cancelled by you')
            : new slack_block_models_1.MarkdownText('Sorry! This trip cannot be rescheduled as it was recently'
                + ` *${tripState.currentState.toLowerCase()}* by <@${tripState.lastActionById}>`);
    }
    static sendRescheduleModal(payload, tripRequestId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const modal = yield RescheduleHelper.getRescheduleModal(tripRequestId, payload.response_url);
                const token = yield teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken(payload.team.id);
                return SlackViews_1.default(token).open(payload.trigger_id, modal);
            }
            catch (err) {
                bugsnagHelper_1.default.log(err);
            }
        });
    }
    static getRescheduleModal(tripRequestId, origin) {
        const defaultDate = moment_1.default().format('YYYY-MM-DD');
        const date = new slack_block_models_1.InputBlock(new slack_block_models_1.DatePicker(defaultDate, 'select a date', 'date'), 'Select Date', 'date');
        const time = new slack_block_models_1.InputBlock(new slack_block_models_1.TextInput('HH:mm', 'time'), 'Time', 'time');
        const modal = slack_block_models_1.Modal.createModal({
            modalTitle: 'Reschedule Trip',
            modalOptions: {
                submit: 'Reschedule',
                close: 'Cancel',
            },
            inputBlocks: [date, time],
            metadata: JSON.stringify({ origin, tripId: tripRequestId.toString() }),
            callbackId: actions_1.default.reschedule,
        });
        return modal;
    }
}
exports.default = RescheduleHelper;
//# sourceMappingURL=reschedule.helper.js.map