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
const SlackDialogModels_1 = require("../../../SlackModels/SlackDialogModels");
const teamDetails_service_1 = require("../../../../teamDetails/teamDetails.service");
const WebClientSingleton_1 = __importDefault(require("../../../../../utils/WebClientSingleton"));
const JoinRouteDialogPrompts_1 = __importDefault(require("../JoinRouteDialogPrompts"));
const DialogPrompts_1 = __importDefault(require("../../../SlackPrompts/DialogPrompts"));
jest.mock('../../../../../helpers/slack/slackHelpers');
jest.mock('../../../../../services/AISService');
describe('JoinRouteDialogPrompts', () => {
    let engagement = null;
    beforeEach(() => {
        engagement = { startDate: '', endDate: '', partnerStatus: '' };
        jest.spyOn(teamDetails_service_1.teamDetailsService, 'getTeamDetailsBotOauthToken')
            .mockResolvedValue('token');
    });
    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });
    describe('sendFellowDetailsForm', () => {
        it('should call sendDialogTryCatch', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = { trigger_id: 'triggerId', team: { id: 'teamId' }, user: { id: 'userId' } };
            const addElementsSpy = jest.spyOn(SlackDialogModels_1.SlackDialog.prototype, 'addElements');
            const sendDialog = jest.spyOn(DialogPrompts_1.default, 'sendDialog');
            const webSpy = jest.spyOn(WebClientSingleton_1.default, 'getWebClient')
                .mockImplementation(() => ({
                dialog: {
                    open: jest.fn()
                }
            }));
            yield JoinRouteDialogPrompts_1.default.sendFellowDetailsForm(payload, 2, engagement);
            expect(addElementsSpy).toBeCalledTimes(1);
            expect(webSpy).toBeCalled();
            expect(sendDialog).toBeCalled();
        }));
    });
});
//# sourceMappingURL=DialogPrompts.spec.js.map