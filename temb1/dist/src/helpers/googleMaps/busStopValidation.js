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
const SlackDialogModels_1 = require("../../modules/slack/SlackModels/SlackDialogModels");
const index_1 = __importDefault(require("./index"));
const homebase_service_1 = require("../../modules/homebases/homebase.service");
const HomeBaseHelper_1 = __importDefault(require("../HomeBaseHelper"));
const validateBusStop = (otherBusStop, selectBusStop, user) => __awaiter(void 0, void 0, void 0, function* () {
    if (!otherBusStop && !selectBusStop) {
        const error = new SlackDialogModels_1.SlackDialogError('otherBusStop', 'One of the fields must be filled.');
        return { errors: [error] };
    }
    if (otherBusStop && selectBusStop) {
        const error = new SlackDialogModels_1.SlackDialogError('otherBusStop', 'You can not fill in this field if you selected a stop in the drop down');
        return { errors: [error] };
    }
    const busStop = selectBusStop || otherBusStop;
    if (!index_1.default.isCoordinate(busStop)) {
        return {
            errors: [
                new SlackDialogModels_1.SlackDialogError('otherBusStop', 'You must submit a valid coordinate')
            ]
        };
    }
    const homebase = yield homebase_service_1.homebaseService.getHomeBaseBySlackId(user.id, true);
    if (!(yield HomeBaseHelper_1.default.checkLocationInHomeBase(busStop, homebase))) {
        return {
            errors: [new SlackDialogModels_1.SlackDialogError(selectBusStop ? 'selectBusStop' : 'otherBusStop', 'The selected location should be within your homebase country')]
        };
    }
});
exports.default = validateBusStop;
//# sourceMappingURL=busStopValidation.js.map