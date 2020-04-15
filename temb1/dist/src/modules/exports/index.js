"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ExportsController_1 = __importDefault(require("./ExportsController"));
const middlewares_1 = __importDefault(require("../../middlewares"));
const ValidationSchemas_1 = __importDefault(require("../../middlewares/ValidationSchemas"));
const exportsRouter = express_1.Router();
const { mainValidator } = middlewares_1.default;
exportsRouter.get('/export/pdf', mainValidator(ValidationSchemas_1.default.exportToDocument), ExportsController_1.default.exportToPDF);
exportsRouter.get('/export/csv', mainValidator(ValidationSchemas_1.default.exportToDocument), ExportsController_1.default.exportToCSV);
exports.default = exportsRouter;
//# sourceMappingURL=index.js.map