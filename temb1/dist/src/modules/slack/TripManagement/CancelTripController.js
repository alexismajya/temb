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
const bugsnagHelper_1 = __importDefault(require("../../../helpers/bugsnagHelper"));
const SlackMessageModels_1 = require("../SlackModels/SlackMessageModels");
const slackEvents_1 = require("../events/slackEvents");
class CancelTripController {
    static cancelTrip(tripId, payload, respond) {
        return __awaiter(this, void 0, void 0, function* () {
            let message;
            try {
                const trip = yield trip_service_1.default.getById(Number(tripId));
                if (!trip) {
                    message = 'Trip not found';
                }
                else {
                    yield trip_service_1.default.updateRequest(tripId, { tripStatus: 'Cancelled' });
                    const { origin: { address: originAddress }, destination: { address: destinationAdress } } = trip;
                    message = `Success! Your Trip request from ${originAddress} to ${destinationAdress} has been cancelled`;
                    if (trip.approvedById) {
                        slackEvents_1.SlackEvents.raise(slackEvents_1.slackEventNames.RIDER_CANCEL_TRIP, payload, trip, respond);
                        slackEvents_1.SlackEvents.raise(slackEvents_1.slackEventNames.NOTIFY_OPS_CANCELLED_TRIP, payload, trip, respond);
                    }
                }
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                message = `Request could not be processed, ${error.message}`;
            }
            return new SlackMessageModels_1.SlackInteractiveMessage(message);
        });
    }
}
exports.default = CancelTripController;
//# sourceMappingURL=CancelTripController.js.map