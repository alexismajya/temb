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
const AISService_1 = __importDefault(require("../../../services/AISService"));
const slackHelpers_1 = __importDefault(require("../../../helpers/slack/slackHelpers"));
const cache_1 = __importDefault(require("../../shared/cache"));
function dateProcessor(date) {
    const [year, month, days] = date.split('-');
    const day = days.substr(0, 2);
    return `${day}/${month}/${year}`;
}
exports.dateProcessor = dateProcessor;
function dateFaker(status, starting) {
    const date = new Date();
    const year = date.getFullYear();
    let fake;
    if (status === 'start') {
        fake = `01/01/${year}`;
    }
    else if (starting) {
        const endyear = parseInt(starting.split('/')[2], 0) + 4;
        fake = `${starting.split('/')[0]}/${starting.split('/')[1]}/${endyear}`;
    }
    else {
        fake = `01/01/${parseInt(year, 0) + 4}`;
    }
    return fake;
}
exports.dateFaker = dateFaker;
class FormHandler {
    constructor(email) {
        this.email = email;
        this.userData = null;
    }
    getUserDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.userData) {
                this.userData = yield AISService_1.default.getUserDetails(this.email);
            }
            return this.userData;
        });
    }
    getStartDate() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return dateProcessor(this.userData.placement.start_date);
            }
            catch (error) {
                return dateFaker('start', null);
            }
        });
    }
    getEndDate() {
        return __awaiter(this, void 0, void 0, function* () {
            let processedDate;
            try {
                processedDate = dateProcessor(this.userData.placement.end_date);
            }
            catch (error) {
                if (this.userData.placement) {
                    processedDate = dateFaker('end', dateProcessor(this.userData.placement.start_date));
                }
                else {
                    processedDate = dateFaker('end', null);
                }
            }
            return processedDate;
        });
    }
    getPartnerStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.userData.placement.client;
            }
            catch (error) {
                return '--';
            }
        });
    }
    isFellowOnEngagement() {
        const { placement } = this.userData;
        return placement && placement.status.includes('External Engagements');
    }
}
exports.FormHandler = FormHandler;
function getFellowEngagementDetails(userId, teamId) {
    return __awaiter(this, void 0, void 0, function* () {
        const getFellowKey = (userSlackId) => `userDetails${userSlackId}`;
        const userReturnData = yield slackHelpers_1.default.getUserInfoFromSlack(userId, teamId);
        const { profile: { email } } = userReturnData;
        const form = new FormHandler(email);
        yield form.getUserDetails();
        if (!form.isFellowOnEngagement()) {
            return;
        }
        const [startDate, endDate, partnerStatus] = yield Promise.all([
            form.getStartDate(),
            form.getEndDate(),
            form.getPartnerStatus()
        ]);
        yield cache_1.default.saveObject(getFellowKey(userId), [startDate, endDate, partnerStatus]);
        return { startDate, endDate, partnerStatus };
    });
}
exports.getFellowEngagementDetails = getFellowEngagementDetails;
exports.toLabelValuePairs = (data, { labelProp, valueProp }) => data.map((item) => ({
    label: item[labelProp],
    value: item[valueProp]
}));
exports.default = {
    getFellowEngagementDetails, FormHandler, dateProcessor, dateFaker
};
//# sourceMappingURL=formHelper.js.map