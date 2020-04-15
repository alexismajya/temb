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
const path_1 = require("path");
const fs_1 = __importDefault(require("fs"));
const bugsnagHelper_1 = __importDefault(require("../helpers/bugsnagHelper"));
const EmailService_1 = __importDefault(require("../modules/emails/EmailService"));
require('../load-env');
class UploadWeeklyTemplate extends EmailService_1.default {
    constructor() {
        super();
        this.domain = process.env.MAILGUN_DOMAIN;
        this.weeklyTemplate = () => __awaiter(this, void 0, void 0, function* () {
            try {
                this.uploadTemplate('../views/email/weeklyReport.html', 'weekly', 'used to send weekly trips information');
            }
            catch (e) {
                bugsnagHelper_1.default.log(e);
            }
        });
        this.providerMonthlyReport = () => __awaiter(this, void 0, void 0, function* () {
            try {
                this.uploadTemplate('../views/email/providersMonthlyReport.html', 'providers', 'Used to send monthly trips by provider to Ops');
            }
            catch (e) {
                bugsnagHelper_1.default.log(e);
            }
        });
        this.uploadTemplate = (templatePath, name, description) => __awaiter(this, void 0, void 0, function* () {
            const path = path_1.resolve(__dirname, templatePath);
            const template = this.readfile(path);
            const body = yield this.client.post(`/${this.domain}/templates`, {
                template,
                name,
                description,
                engine: 'handlebars',
            });
            console.log(body.message);
        });
        this.pushTemplates = () => __awaiter(this, void 0, void 0, function* () {
            yield this.providerMonthlyReport();
            yield this.weeklyTemplate();
        });
    }
    readfile(path) {
        return fs_1.default.readFileSync(path).toString();
    }
}
const uploadTemplates = new UploadWeeklyTemplate();
uploadTemplates.pushTemplates();
exports.default = uploadTemplates;
//# sourceMappingURL=uploadTemplates.js.map