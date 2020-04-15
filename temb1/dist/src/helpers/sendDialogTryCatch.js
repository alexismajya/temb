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
const WebClientSingleton_1 = __importDefault(require("../utils/WebClientSingleton"));
const bugsnagHelper_1 = __importDefault(require("./bugsnagHelper"));
exports.default = (dialogForm, teamBotOauthToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield WebClientSingleton_1.default.getWebClient(teamBotOauthToken).dialog.open(dialogForm);
    }
    catch (error) {
        bugsnagHelper_1.default.log(error);
        throw new Error('There was a problem processing your request');
    }
});
//# sourceMappingURL=sendDialogTryCatch.js.map