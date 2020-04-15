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
const teamDetails_service_1 = require("../../../../teamDetails/teamDetails.service");
const slack_helpers_1 = __importDefault(require("../../../helpers/slack-helpers"));
const validators_1 = __importDefault(require("../validators"));
describe('Validators', () => {
    const payload = {
        submission: {
            pickup: 'Nairobi',
            othersPickup: null,
            dateTime: moment_1.default().add(1, 'days').format('DD/MM/YYYY HH:mm'),
        },
        team: {
            id: 'HGYYY667'
        },
        user: {
            id: 'HUIO56LO'
        },
        state: '{ "origin": "https://origin.com"}'
    };
    describe('validatePickUpSubmission', () => {
        it('should validate pickup submission successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsBotOauthToken').mockResolvedValue('botToken');
            jest.spyOn(slack_helpers_1.default, 'getUserInfo').mockResolvedValue({ tz: 'America/Los_Angeles' });
            yield validators_1.default.validatePickUpSubmission(payload);
            expect(teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken).toHaveBeenCalled();
            expect(slack_helpers_1.default.getUserInfo).toHaveBeenCalledWith(payload.user.id, 'botToken');
        }));
    });
});
//# sourceMappingURL=validators.spec.js.map