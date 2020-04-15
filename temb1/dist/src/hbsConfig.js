"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_handlebars_1 = __importDefault(require("express-handlebars"));
const hbsConfig = (app) => {
    const hbs = express_handlebars_1.default.create({
        defaultLayout: '_layout.html',
        baseTemplates: app.get('views'),
        layoutsDir: `${app.get('views')}/layouts`,
        partialsDir: [`${app.get('views')}/partials`]
    });
    return hbs;
};
exports.default = hbsConfig;
//# sourceMappingURL=hbsConfig.js.map