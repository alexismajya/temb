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
const AISService_1 = __importDefault(require("../../../../services/AISService"));
const formHelper_1 = require("../formHelper");
const cache_1 = __importDefault(require("../../../shared/cache"));
describe('it should return fellows data as expected', () => {
    let oldFellowData = null;
    let newFellowData = null;
    let maxAISData = null;
    let minAISData = null;
    const data = { profile: { email: 'testmail@test.com' } };
    const fullUserData = {
        placement: { start_date: '2017-11-13T15:33:24.140Z', end_date: '', client: 'testClient' }
    };
    const missingUserData = {
        data: 'new felloe'
    };
    const userId = 200;
    const teamId = 1000;
    beforeEach(() => {
        oldFellowData = jest.spyOn(slackHelpers_1.default, 'getUserInfoFromSlack').mockResolvedValue(data);
        newFellowData = jest.spyOn(slackHelpers_1.default, 'getUserInfoFromSlack').mockResolvedValue(data);
        maxAISData = jest.spyOn(AISService_1.default, 'getUserDetails').mockResolvedValue(fullUserData);
        minAISData = jest.spyOn(AISService_1.default, 'getUserDetails').mockResolvedValue(missingUserData);
        jest.spyOn(cache_1.default, 'saveObject');
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe('FormHandler', () => {
        it('should getUserDetails', () => __awaiter(void 0, void 0, void 0, function* () {
            formHelper_1.dateProcessor.prototype = jest.fn().mockReturnValue(fullUserData.placement.start_date);
            const startDate = yield new formHelper_1.FormHandler('').getStartDate();
            expect(startDate).toEqual('01/01/2020');
        }));
        it('should getEndDate', () => __awaiter(void 0, void 0, void 0, function* () {
            formHelper_1.dateProcessor.prototype = jest.fn().mockReturnValue(fullUserData.placement.start_date);
            formHelper_1.dateFaker.prototype = jest.fn().mockReturnValue(fullUserData.placement.start_date);
            const formData = new formHelper_1.FormHandler('');
            formData.dateProcessor = jest.fn();
            formData.dateProcessor.mockImplementation((date) => {
                jest.spyOn(date, 'split').mockResolvedValue();
                return fullUserData.placement.start_date;
            });
            formData.userData = fullUserData;
            const startDate = yield formData.getEndDate();
            expect(startDate).toEqual('13/11/2021');
        }));
        it('should getEndDate error not placed', () => __awaiter(void 0, void 0, void 0, function* () {
            formHelper_1.dateFaker.prototype = jest.fn().mockReturnValue(fullUserData.placement.start_date);
            const formData = new formHelper_1.FormHandler('');
            formData.userData = { placement: null };
            const endDate = yield formData.getEndDate();
            expect(endDate).toEqual('01/01/2024');
        }));
        it('should getPartnerStatus', () => __awaiter(void 0, void 0, void 0, function* () {
            const formData = new formHelper_1.FormHandler('');
            formData.userData = fullUserData;
            const getPartnerStatus = yield formData.getPartnerStatus();
            expect(getPartnerStatus).toEqual('testClient');
        }));
        it('should fail getPartnerStatus', () => __awaiter(void 0, void 0, void 0, function* () {
            const formData = new formHelper_1.FormHandler('');
            formData.userData = null;
            const getPartnerStatus = yield formData.getPartnerStatus();
            expect(getPartnerStatus).toEqual('--');
        }));
        it('should check isFellowOnEngagement expect true', () => __awaiter(void 0, void 0, void 0, function* () {
            const formData = new formHelper_1.FormHandler('');
            formData.userData = { placement: { status: 'External Engagements blablabla' } };
            const isFellowOnEngagement = formData.isFellowOnEngagement();
            expect(isFellowOnEngagement).toEqual(true);
        }));
        it('should check isFellowOnEngagement expect false', () => __awaiter(void 0, void 0, void 0, function* () {
            const formData = new formHelper_1.FormHandler('');
            formData.userData = { placement: { status: 'External blablabla' } };
            const isFellowOnEngagement = formData.isFellowOnEngagement();
            expect(isFellowOnEngagement).toEqual(false);
        }));
    });
    describe('getFellowEngagementDetails', () => {
        it('should fetch data from the slack helpers class', () => __awaiter(void 0, void 0, void 0, function* () {
            formHelper_1.FormHandler.prototype.getStartDate = jest.fn().mockReturnValue(true);
            formHelper_1.FormHandler.prototype.getEndDate = jest.fn().mockReturnValue(true);
            formHelper_1.FormHandler.prototype.getPartnerStatus = jest.fn().mockReturnValue(true);
            formHelper_1.FormHandler.prototype.isFellowOnEngagement = jest.fn().mockReturnValue(true);
            yield formHelper_1.getFellowEngagementDetails(userId, teamId);
            expect(oldFellowData).toBeCalledWith(200, 1000);
            expect(newFellowData).toBeCalledWith(200, 1000);
            expect(maxAISData).toBeCalledWith('testmail@test.com');
            expect(minAISData).toBeCalledWith('testmail@test.com');
        }));
        it('should not fetch data for fellow not on external engagement', () => __awaiter(void 0, void 0, void 0, function* () {
            formHelper_1.FormHandler.prototype.getStartDate = jest.fn().mockReturnValue(true);
            formHelper_1.FormHandler.prototype.getEndDate = jest.fn().mockReturnValue(true);
            formHelper_1.FormHandler.prototype.getPartnerStatus = jest.fn().mockReturnValue(true);
            formHelper_1.FormHandler.prototype.isFellowOnEngagement = jest.fn().mockReturnValue(false);
            yield formHelper_1.getFellowEngagementDetails(userId, teamId);
            expect(oldFellowData).toBeCalledWith(200, 1000);
            expect(newFellowData).toBeCalledWith(200, 1000);
            expect(maxAISData).toBeCalledWith('testmail@test.com');
            expect(minAISData).toBeCalledWith('testmail@test.com');
        }));
        it('should cache fellow data from AIS', () => __awaiter(void 0, void 0, void 0, function* () {
            formHelper_1.FormHandler.prototype.getStartDate = jest.fn().mockReturnValue('12/01/2015');
            formHelper_1.FormHandler.prototype.getEndDate = jest.fn().mockReturnValue('12/07/2019');
            formHelper_1.FormHandler.prototype.getPartnerStatus = jest.fn().mockReturnValue('Safaricom');
            formHelper_1.FormHandler.prototype.isFellowOnEngagement = jest.fn().mockReturnValue(true);
            yield formHelper_1.getFellowEngagementDetails(userId, teamId);
            const resultArray = ['12/01/2015', '12/07/2019', 'Safaricom'];
            expect(cache_1.default.saveObject).toHaveBeenCalledWith('userDetails200', resultArray);
        }));
    });
});
//# sourceMappingURL=formHelper.spec.js.map