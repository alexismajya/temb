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
const teamDetails_service_1 = require("../../../modules/teamDetails/teamDetails.service");
const slackHelpers_1 = __importDefault(require("../slackHelpers"));
jest.mock('@slack/client', () => ({
    WebClient: jest.fn(() => ({
        users: {
            info: () => ({
                user: {
                    tz_offset: 3600,
                    id: '23MTU2',
                    name: 'sande'
                }
            })
        }
    }))
}));
jest
    .spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsBotOauthToken').mockResolvedValue({ botToken: '2323' });
describe('test getUserInfoFromSlack by slackId ', () => {
    beforeEach(() => {
        slackHelpers_1.default.findOrCreateUserBySlackId = jest.fn(() => ({
            username: 'santos',
            email: 'tembea@tem.com'
        }));
    });
    afterEach(() => {
        jest.resetAllMocks();
    });
    it('should return existing user', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield slackHelpers_1.default.getUserInfoFromSlack('23MTU2', 'TI34DJ');
        expect(result).toEqual({ id: '23MTU2', name: 'sande', tz_offset: 3600 });
        expect(teamDetails_service_1.teamDetailsService.getTeamDetailsBotOauthToken).toHaveBeenCalledTimes(1);
    }));
});
//# sourceMappingURL=getUserInfoFromSlack.spec.js.map