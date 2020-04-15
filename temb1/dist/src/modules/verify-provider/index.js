"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ProviderController_1 = __importDefault(require("../providers/ProviderController"));
const app = express_1.default.Router();
app.post('/providers/verify', ProviderController_1.default.activateProvider);
exports.default = app;
//# sourceMappingURL=index.js.map