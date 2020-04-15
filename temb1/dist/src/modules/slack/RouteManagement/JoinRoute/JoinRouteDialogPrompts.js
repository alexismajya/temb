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
const SlackDialogModels_1 = require("../../SlackModels/SlackDialogModels");
const DialogPrompts_1 = __importDefault(require("../../SlackPrompts/DialogPrompts"));
class JoinRouteDialogPrompts {
    static sendFellowDetailsForm(payload, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const selectManager = new SlackDialogModels_1.SlackDialogElementWithDataSource('Select Manager', 'manager');
            const dialog = new SlackDialogModels_1.SlackDialog('join_route_fellowDetails', 'Enter your details', 'submit', true, value);
            const workHoursText = new SlackDialogModels_1.SlackDialogText('Work hours', 'workHours', '18:00 - 00:00', false, 'hh:mm E.g. 18:00 - 00:00');
            dialog.addElements([selectManager, workHoursText]);
            yield DialogPrompts_1.default.sendDialog(dialog, payload);
        });
    }
}
exports.default = JoinRouteDialogPrompts;
//# sourceMappingURL=JoinRouteDialogPrompts.js.map