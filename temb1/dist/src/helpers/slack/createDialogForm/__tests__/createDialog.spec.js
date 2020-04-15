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
const index_1 = __importDefault(require("../index"));
const createTripDetailsForm_1 = __importDefault(require("../../createTripDetailsForm"));
const SlackDialogModels_1 = require("../../../../modules/slack/SlackModels/SlackDialogModels");
const homebase_service_1 = require("../../../../modules/homebases/homebase.service");
describe('createDialogForm tests', () => {
    const payload = { user: { id: 1 } };
    it('should test that new dialog is created', () => __awaiter(void 0, void 0, void 0, function* () {
        const createTripDetailsFormHandler = jest
            .spyOn(createTripDetailsForm_1.default, 'regularTripForm')
            .mockImplementation(() => { });
        jest.spyOn(homebase_service_1.homebaseService, 'getHomeBaseBySlackId').mockResolvedValue({ name: 'Kampala' });
        const dialogForm = yield index_1.default(payload, 'regularTripForm', 'someCallbackId');
        expect(createTripDetailsFormHandler).toBeCalled();
        expect(dialogForm instanceof SlackDialogModels_1.SlackDialogModel).toBeTruthy();
    }));
});
//# sourceMappingURL=createDialog.spec.js.map