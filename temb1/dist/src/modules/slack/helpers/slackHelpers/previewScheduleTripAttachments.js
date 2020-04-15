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
const slackHelpers_1 = __importDefault(require("../../../../helpers/slack/slackHelpers"));
const SlackMessageModels_1 = require("../../SlackModels/SlackMessageModels");
const GoogleMapsDistanceMatrix_1 = __importDefault(require("../../../../services/googleMaps/GoogleMapsDistanceMatrix"));
const cache_1 = __importDefault(require("../../../shared/cache"));
class PreviewScheduleTrip {
    static getRider(riderId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (riderId) {
                const rider = yield slackHelpers_1.default.findUserByIdOrSlackId(riderId);
                if (rider) {
                    return rider;
                }
                return { name: '' };
            }
        });
    }
    static formatName(name) {
        if (typeof name === 'string') {
            return name.split('.').map((txt) => `${txt[0].toUpperCase()}${txt.substr(1)}`).join(' ');
        }
    }
    static returnPreview(userDetails) {
        const { passengerName, passengers, userName, pickup, destination, dateTime, department, reason } = userDetails;
        return [
            new SlackMessageModels_1.SlackAttachmentField('Passenger\'s Name', `${passengerName}`, true),
            new SlackMessageModels_1.SlackAttachmentField('Number of Passengers', passengers, true),
            new SlackMessageModels_1.SlackAttachmentField('Requester (Trip)', userName, true),
            new SlackMessageModels_1.SlackAttachmentField('Pickup Location', pickup, true),
            new SlackMessageModels_1.SlackAttachmentField('Destination', destination, true),
            new SlackMessageModels_1.SlackAttachmentField('Pick-Up Date/Time', dateTime, true),
            new SlackMessageModels_1.SlackAttachmentField('Department', department.name, true),
            new SlackMessageModels_1.SlackAttachmentField('Reason for Trip', reason, true),
        ];
    }
    static getDistance(pickupLat, pickupLong, destLat, destLong) {
        return __awaiter(this, void 0, void 0, function* () {
            const origins = `${pickupLat}, ${pickupLong}`;
            const destinations = `${destLat}, ${destLong}`;
            const { distanceInKm } = yield GoogleMapsDistanceMatrix_1.default.calculateDistance(origins, destinations);
            return distanceInKm;
        });
    }
    static saveDistance(tripDetails, distance) {
        return __awaiter(this, void 0, void 0, function* () {
            const tripData = Object.assign({}, tripDetails);
            tripData.distance = distance;
            yield cache_1.default.saveObject(tripDetails.id, tripData);
        });
    }
    static previewDistance(distance, result) {
        if (distance && distance !== 'unknown') {
            result.push(new SlackMessageModels_1.SlackAttachmentField('Distance', distance, true));
            return result;
        }
        return result;
    }
    static previewScheduleTripAttachments(tripDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pickup, destination, pickupLat, destinationLat, passengers, department, forSelf, dateTime, reason, rider, name, pickupLong, destinationLong, } = tripDetails;
            const tripData = Object.assign({}, tripDetails);
            const userName = PreviewScheduleTrip.formatName(name);
            const passengerName = forSelf === 'true' ? userName : (yield PreviewScheduleTrip.getRider(rider)).name;
            const userDetails = {
                passengerName, passengers, userName, pickup, destination, dateTime, department, reason
            };
            if (pickupLat && destinationLat) {
                const distance = yield PreviewScheduleTrip
                    .getDistance(pickupLat, pickupLong, destinationLat, destinationLong);
                const result = [...PreviewScheduleTrip.returnPreview(userDetails)];
                const previewData = PreviewScheduleTrip.previewDistance(distance, result);
                yield PreviewScheduleTrip.saveDistance(tripData, distance);
                return previewData;
            }
            return PreviewScheduleTrip.returnPreview(userDetails);
        });
    }
}
exports.default = PreviewScheduleTrip;
//# sourceMappingURL=previewScheduleTripAttachments.js.map