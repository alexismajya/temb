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
const country_list_1 = require("country-list");
const country_code_emoji_1 = __importDefault(require("country-code-emoji"));
const cab_service_1 = require("../../modules/cabs/cab.service");
const trip_service_1 = __importDefault(require("../../modules/trips/trip.service"));
const WebClientSingleton_1 = __importDefault(require("../../utils/WebClientSingleton"));
const teamDetails_service_1 = require("../../modules/teamDetails/teamDetails.service");
const user_service_1 = __importDefault(require("../../modules/users/user.service"));
const cache_1 = __importDefault(require("../../modules/shared/cache"));
class SlackHelpers {
    static findUserByIdOrSlackId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const normalizedId = Number.parseInt(userId, 10);
            const user = Number.isInteger(normalizedId)
                ? yield user_service_1.default.getUserById(normalizedId)
                : yield user_service_1.default.getUserBySlackId(userId);
            return user;
        });
    }
    static findOrCreateUserBySlackId(slackId, teamId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield user_service_1.default.getUserBySlackId(slackId);
            if (existingUser)
                return existingUser;
            const user = yield SlackHelpers.getUserInfoFromSlack(slackId, teamId);
            user.profile.real_name = user.real_name;
            const newUser = yield user_service_1.default.createNewUser(user);
            return newUser;
        });
    }
    static getUserInfoFromSlack(slackId, teamId) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = `${teamId}_${slackId}`;
            const result = yield cache_1.default.fetch(key);
            if (result && result.slackInfo) {
                return result.slackInfo;
            }
            const slackBotOauthToken = yield teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken(teamId);
            const userInfo = yield SlackHelpers.fetchUserInformationFromSlack(slackId, slackBotOauthToken);
            yield cache_1.default.save(key, 'slackInfo', userInfo);
            return userInfo;
        });
    }
    static fetchUserInformationFromSlack(slackId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = yield WebClientSingleton_1.default.getWebClient(token).users.info({
                user: slackId
            });
            return user;
        });
    }
    static isRequestApproved(requestId, slackId) {
        return __awaiter(this, void 0, void 0, function* () {
            let isApproved = false;
            let approvedBy = null;
            const trip = yield trip_service_1.default.getById(requestId);
            if (!trip) {
                return { isApproved: false, approvedBy };
            }
            const { tripStatus, approvedById } = trip;
            if (approvedById && tripStatus && tripStatus.toLowerCase() !== 'pending') {
                isApproved = true;
                const user = yield SlackHelpers.findUserByIdOrSlackId(approvedById);
                approvedBy = slackId === user.slackId ? '*You*' : `<@${user.slackId}>`;
            }
            return { isApproved, approvedBy };
        });
    }
    static approveRequest(requestId, managerId, description) {
        return __awaiter(this, void 0, void 0, function* () {
            let approved = false;
            const user = yield SlackHelpers.findUserByIdOrSlackId(managerId);
            const update = yield trip_service_1.default.updateRequest(requestId, {
                approvedById: user.id,
                managerComment: description,
                tripStatus: 'Approved'
            });
            if (update) {
                approved = true;
            }
            return approved;
        });
    }
    static noOfPassengers(startingPoint = 1) {
        const passengerNumbers = [...Array(10)].map((label, value) => ({ text: `${value + startingPoint}`, value: value + startingPoint }));
        return passengerNumbers;
    }
    static handleCancellation(tripRequestId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tripStatus } = yield trip_service_1.default.getById(tripRequestId);
            return tripStatus === 'Cancelled';
        });
    }
    static addMissingTripObjects(updatedTrip) {
        return __awaiter(this, void 0, void 0, function* () {
            const trip = {};
            if (updatedTrip.declinedById) {
                trip.decliner = yield user_service_1.default.getUserById(updatedTrip.declinedById);
            }
            if (updatedTrip.confirmedById) {
                trip.confirmer = yield user_service_1.default.getUserById(updatedTrip.confirmedById);
            }
            if (updatedTrip.cabId) {
                trip.cab = yield cab_service_1.cabService.getById(updatedTrip.cabId);
            }
            if (updatedTrip.operationsComment) {
                trip.operationsComment = updatedTrip.operationsComment;
            }
            return trip;
        });
    }
    static getLocationCountryFlag(countryName) {
        const code = country_list_1.getCode(countryName);
        return country_code_emoji_1.default(code);
    }
}
exports.default = SlackHelpers;
//# sourceMappingURL=slackHelpers.js.map