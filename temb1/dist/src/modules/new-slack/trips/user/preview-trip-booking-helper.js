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
const slack_block_models_1 = require("../../models/slack-block-models");
const cache_1 = __importDefault(require("../../../shared/cache"));
const ScheduleTripInputHandlers_1 = require("../../../../helpers/slack/ScheduleTripInputHandlers");
const dateHelpers_1 = require("../../../slack/helpers/dateHelpers");
const previewScheduleTripAttachments_1 = __importDefault(require("../../../slack/helpers/slackHelpers/previewScheduleTripAttachments"));
const address_service_1 = require("../../../addresses/address.service");
class PreviewTripBooking {
    static returnPreview({ passengerName, passengers, userName, pickupName, destinationName, dateTime, department, reason }) {
        return [
            new slack_block_models_1.MarkdownText(`*Passenger's Name* \n${passengerName}`),
            new slack_block_models_1.MarkdownText(`*Number of Passengers* \n${passengers}`),
            new slack_block_models_1.MarkdownText(`*Requester (Trip)* \n${userName}`),
            new slack_block_models_1.MarkdownText(`*Pickup Location* \n${pickupName}`),
            new slack_block_models_1.MarkdownText(`*Destination* \n${destinationName}`),
            new slack_block_models_1.MarkdownText(`*Pick-Up Date/Time* \n${dateHelpers_1.getSlackDateString(dateTime)}`),
            new slack_block_models_1.MarkdownText(`*Department* \n${department}`),
            new slack_block_models_1.MarkdownText(`*Reason for Trip* \n${reason}`),
        ];
    }
    static getRiderName(rider) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = yield previewScheduleTripAttachments_1.default.getRider(rider);
                return name;
            }
            catch (err) {
                return err;
            }
        });
    }
    static saveDistance(tripData, distance) {
        return __awaiter(this, void 0, void 0, function* () {
            yield cache_1.default.save(ScheduleTripInputHandlers_1.getTripKey(tripData.id), 'distance', distance);
        });
    }
    static previewDistance(distance, preview) {
        if (distance && distance !== 'unknown') {
            preview.push(new slack_block_models_1.MarkdownText(`*Distance* \n${distance}`));
            return preview;
        }
        return preview;
    }
    static getPreviewFields(tripDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pickupLat, destinationLat, passengers, department, forMe, dateTime, reason, name, pickupLong, destinationLong, rider, } = tripDetails;
            const { pickupName, destinationName } = yield PreviewTripBooking
                .getOtherPickupAndDestination(tripDetails);
            const userName = previewScheduleTripAttachments_1.default.formatName(name);
            let passengerName = userName;
            if (!forMe)
                passengerName = yield PreviewTripBooking.getRiderName(rider);
            const preview = PreviewTripBooking.returnPreview({
                reason,
                passengers,
                userName,
                pickupName,
                department,
                dateTime,
                destinationName,
                passengerName,
            });
            if (pickupLat && destinationLat) {
                const distance = yield previewScheduleTripAttachments_1.default
                    .getDistance(pickupLat, pickupLong, destinationLat, destinationLong);
                yield PreviewTripBooking.saveDistance(tripDetails, distance);
                const previewData = PreviewTripBooking.previewDistance(distance, preview);
                return previewData;
            }
            return preview;
        });
    }
    static getOtherPickupAndDestination(tripDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const { othersPickup, othersDestination, pickup, destination } = tripDetails;
            let { pickupId: originId, destinationId } = tripDetails;
            if (!originId) {
                ({ id: originId } = yield address_service_1.addressService.findOrCreateAddress(othersPickup));
            }
            if (!destinationId) {
                ({ id: destinationId } = yield address_service_1.addressService.findOrCreateAddress(othersDestination));
            }
            const pickupName = othersPickup || pickup;
            const destinationName = othersDestination || destination;
            return {
                pickupName, destinationName, originId, destinationId
            };
        });
    }
}
exports.default = PreviewTripBooking;
//# sourceMappingURL=preview-trip-booking-helper.js.map