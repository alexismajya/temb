"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("../modules/shared/utilities");
const environment_1 = __importDefault(require("../config/environment"));
const utils = new utilities_1.Utilities(environment_1.default);
exports.default = utils;
//# sourceMappingURL=index.js.map