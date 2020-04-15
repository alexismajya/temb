"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const HomeController_1 = __importDefault(require("./HomeController"));
const homeRouter = express_1.default.Router();
homeRouter.get('/', HomeController_1.default.index);
homeRouter.get('/slackauth', HomeController_1.default.auth);
homeRouter.get('/install', HomeController_1.default.install);
homeRouter.get('/privacy', HomeController_1.default.privacy);
homeRouter.get('/support', HomeController_1.default.support);
exports.default = homeRouter;
//# sourceMappingURL=index.js.map