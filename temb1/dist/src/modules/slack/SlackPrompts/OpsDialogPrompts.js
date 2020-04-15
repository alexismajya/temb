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
const SlackDialogModels_1 = require("../SlackModels/SlackDialogModels");
const DialogPrompts_1 = __importDefault(require("./DialogPrompts"));
const provider_service_1 = require("../../providers/provider.service");
const homebase_service_1 = require("../../homebases/homebase.service");
const formHelper_1 = require("../helpers/formHelper");
class OpsDialogPrompts {
    static selectDriverAndCab(payload, tripId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user: { id: slackId }, message_ts: timeStamp, channel: { id: channel }, } = payload;
            const state = { tripId, timeStamp, channel, };
            const homebase = yield homebase_service_1.homebaseService.getHomeBaseBySlackId(slackId);
            const providers = yield provider_service_1.providerService.getViableProviders(homebase.id);
            const driversOptionsGroups = OpsDialogPrompts.createOptionsGroups(providers, { name: 'name', prop: 'drivers' }, { label: 'driverName', value: 'id' });
            const cabsOptionsGroups = OpsDialogPrompts.createOptionsGroups(providers, { name: 'name', prop: 'vehicles' }, { label: 'regNumber', value: 'id' });
            const dialog = yield OpsDialogPrompts.createSelectDriverCabDailog(state, driversOptionsGroups, cabsOptionsGroups);
            return DialogPrompts_1.default.sendDialog(dialog, payload);
        });
    }
    static createOptionsGroups(data, { name, prop }, { label, value }) {
        return data.map((entry) => ({
            label: entry[name],
            options: formHelper_1.toLabelValuePairs(entry[prop], { labelProp: label, valueProp: value })
        }));
    }
    static createSelectDriverCabDailog(state, driversOptionsGroups, cabsOptionsGroups) {
        return __awaiter(this, void 0, void 0, function* () {
            const dialog = new SlackDialogModels_1.SlackDialog('ops_approval_trip', 'Assign cab and driver', 'Submit', false, JSON.stringify(state));
            dialog.addElements([
                new SlackDialogModels_1.SlackDialogSelectElementWithOptionGroups('Driver', 'driver', driversOptionsGroups),
                new SlackDialogModels_1.SlackDialogSelectElementWithOptionGroups('Cab', 'cab', cabsOptionsGroups)
            ]);
            return dialog;
        });
    }
}
exports.default = OpsDialogPrompts;
//# sourceMappingURL=OpsDialogPrompts.js.map