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
const ManageTripController_1 = __importDefault(require("../ManageTripController"));
const events_1 = __importDefault(require("../../events"));
const slackEvents_1 = require("../../events/slackEvents");
const trip_service_1 = __importDefault(require("../../../trips/trip.service"));
const department_service_1 = require("../../../departments/department.service");
const teamDetails_service_1 = require("../../../teamDetails/teamDetails.service");
const InteractivePrompts_1 = __importDefault(require("../../../../modules/slack/SlackPrompts/InteractivePrompts"));
jest.mock('../../SlackPrompts/InteractivePrompts');
jest.mock('../../events/index.js');
jest.mock('../../../teamDetails/teamDetails.service');
afterAll(() => {
    jest.restoreAllMocks();
});
describe('Manage trip controller run validations', () => {
    it('should be able to run validations on empty string', (done) => {
        const res = ManageTripController_1.default.runValidation({ declineReason: '        ' });
        expect(res).toEqual([{ name: 'declineReason', error: 'This field cannot be empty' }]);
        done();
    });
    it('should be able to run validations on very long strings', (done) => {
        const res = ManageTripController_1.default.runValidation({
            declineReason: `
      xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
      xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxv
    `,
        });
        expect(res).toEqual([
            { name: 'declineReason', error: 'Character length must be less than or equal to 100' },
        ]);
        done();
    });
});
describe('Manage Trip Controller decline trip', () => {
    const { trips } = JSON.parse(process.env.TEST_DATA);
    const tripDepartureTime = new Date(new Date().getTime() - 864000000).toISOString();
    beforeEach(() => {
        jest.spyOn(events_1.default, 'raise').mockReturnValue();
        jest.spyOn(trip_service_1.default, 'getById')
            .mockImplementation((id) => Promise.resolve({ id, name: 'Test Trip' }));
        jest.spyOn(department_service_1.departmentService, 'getHeadByDeptId')
            .mockResolvedValue({ slackId: 'U123S0' });
        jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsBotOauthToken').mockResolvedValue('token');
        jest.spyOn(InteractivePrompts_1.default, 'sendManagerDeclineOrApprovalCompletion').mockReturnValue();
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    it('should return an error on decline trip request', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(trip_service_1.default, 'getById').mockRejectedValue();
        const res = jest.fn();
        try {
            yield ManageTripController_1.default.declineTrip(['timestamp', 'XXXXXXX', 1000], 'No reason at all', res);
        }
        catch (err) {
            expect(res).toBeCalledWith({
                text: 'Dang, something went wrong there.',
            });
        }
    }));
    it('should decline trip request', () => __awaiter(void 0, void 0, void 0, function* () {
        yield ManageTripController_1.default.declineTrip(['timestamp', 'XXXXXXX', trips[1].id], 'No reason at all', jest.fn());
        expect(events_1.default.raise).toHaveBeenCalledWith(slackEvents_1.slackEventNames.DECLINED_TRIP_REQUEST, expect.any(Object), expect.any(Function), expect.any(String));
    }));
});
//# sourceMappingURL=ManageTripController.spec.js.map