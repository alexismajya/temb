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
const createTripDetailsForm_1 = __importDefault(require("../createTripDetailsForm"));
const SlackDialogModels_1 = require("../../../modules/slack/SlackModels/SlackDialogModels");
const homebase_service_1 = require("../../../modules/homebases/homebase.service");
const address_service_1 = require("../../../modules/addresses/address.service");
exports.default = (payload, formElementsFunctionName, callbackId, dialogTitle = 'Trip Details', defaultNote) => __awaiter(void 0, void 0, void 0, function* () {
    const { user: { id: slackId } } = payload;
    const { name: homebaseName } = yield homebase_service_1.homebaseService.getHomeBaseBySlackId(slackId);
    const addresses = yield address_service_1.addressService.getAddressListByHomebase(homebaseName);
    const stateValue = JSON.stringify(payload);
    const dialog = new SlackDialogModels_1.SlackDialog(callbackId, dialogTitle, 'Submit', ' ', stateValue);
    const formElements = createTripDetailsForm_1.default[formElementsFunctionName](defaultNote, addresses, payload);
    dialog.addElements(formElements);
    return new SlackDialogModels_1.SlackDialogModel(payload.trigger_id, dialog);
});
//# sourceMappingURL=index.js.map