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
const OpsDialogPrompts_1 = __importDefault(require("../OpsDialogPrompts"));
const DialogPrompts_1 = __importDefault(require("../DialogPrompts"));
const homebase_service_1 = require("../../../homebases/homebase.service");
const SlackDialogModels_1 = require("../../SlackModels/SlackDialogModels");
describe('OpsDialogPrompts', () => {
    beforeEach(() => {
        jest.spyOn(DialogPrompts_1.default, 'sendDialog').mockResolvedValue();
        jest.spyOn(homebase_service_1.homebaseService, 'getHomeBaseBySlackId').mockResolvedValue({ id: 1 });
    });
    afterEach(() => {
        jest.resetAllMocks();
    });
    const payloadMock = {
        user: { id: 1 },
        actions: [{ value: 'value_id' }],
        message_ts: '',
        channel: { id: 'channel' }
    };
    it('should send a dialog prompt', () => __awaiter(void 0, void 0, void 0, function* () {
        yield OpsDialogPrompts_1.default.selectDriverAndCab(payloadMock, 1);
        expect(DialogPrompts_1.default.sendDialog).toBeCalledTimes(1);
    }));
    it('should create SelectDriverCabDailog', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield OpsDialogPrompts_1.default.createSelectDriverCabDailog({}, [], []);
        expect(response).toBeInstanceOf(SlackDialogModels_1.SlackDialog);
    }));
});
//# sourceMappingURL=OpsDialogPrompts.spec.js.map