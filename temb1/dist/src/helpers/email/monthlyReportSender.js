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
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const path_1 = require("path");
const EmailService_1 = __importDefault(require("../../modules/emails/EmailService"));
const ReportGeneratorService_1 = __importDefault(require("../../services/report/ReportGeneratorService"));
const department_service_1 = require("../../modules/departments/department.service");
const utils_1 = __importDefault(require("../../utils"));
const bugsnagHelper_1 = __importDefault(require("../bugsnagHelper"));
const teamDetails_service_1 = require("../../modules/teamDetails/teamDetails.service");
class MonthlyReportSender {
    constructor(hbs) {
        this.hbsHelper = hbs;
        this.emailService = new EmailService_1.default();
    }
    send() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allTeams = yield teamDetails_service_1.teamDetailsService.getAllTeams();
                const promises = allTeams.map((team) => this.sendMail(team.teamId));
                yield Promise.all(promises);
                return;
            }
            catch (e) {
                bugsnagHelper_1.default.log(e);
            }
        });
    }
    getTemplate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const template = yield this.hbsHelper.render(`${this.hbsHelper.baseTemplates}/email/email.html`, data);
            return template;
        });
    }
    static processAttachments(attachments) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield Promise.all(attachments.map((element) => __awaiter(this, void 0, void 0, function* () {
                const fileName = path_1.join(os_1.default.tmpdir(), element.filename);
                const writeStream = fs_1.default.createWriteStream(fileName);
                const readStream = utils_1.default.writableToReadableStream(element.content);
                readStream.pipe(writeStream);
                const promise = yield new Promise((resolve, reject) => {
                    readStream.on('end', () => {
                        readStream.close();
                        resolve(fileName);
                    });
                    readStream.on('error', reject);
                });
                return promise;
            })));
            return files;
        });
    }
    generateSendMailAttachment() {
        return __awaiter(this, void 0, void 0, function* () {
            const summary = yield ReportGeneratorService_1.default.getOverallTripsSummary();
            const html = yield this.getTemplate({
                name: 'Operations Team ',
                month: summary.month,
                increased: Number.parseFloat(summary.percentageChange) > 0,
                departments: MonthlyReportSender.departmentToArray(summary.departments),
                summary
            });
            const attachments = [{
                    filename: `${summary.month} Report.xlsx`.replace(/[, ]/g, '_'),
                    content: utils_1.default.writableToReadableStream(yield MonthlyReportSender.getEmailReportAttachment()),
                }];
            const files = yield MonthlyReportSender.processAttachments(attachments);
            return { html, files };
        });
    }
    sendMail() {
        return __awaiter(this, void 0, void 0, function* () {
            const { html, files } = yield this.generateSendMailAttachment();
            if (process.env.TEMBEA_MAIL_ADDRESS && process.env.KENYA_TRAVEL_TEAM_EMAIL) {
                yield this.emailService.sendMail({
                    from: `TEMBEA <${process.env.TEMBEA_MAIL_ADDRESS}>`,
                    to: process.env.KENYA_TRAVEL_TEAM_EMAIL,
                    subject: 'Monthly Report for trips taken by Andelans',
                    attachment: files,
                    html
                });
            }
            else {
                bugsnagHelper_1.default.log('Either TEMBEA_MAIL_ADDRESS or '
                    + 'KENYA_TRAVEL_TEAM_EMAIL has not been set in the .env ');
            }
            try {
                files.forEach((file) => { fs_1.default.unlinkSync(file); });
            }
            catch (err) {
                return err;
            }
        });
    }
    static getAddresses(teamId) {
        return __awaiter(this, void 0, void 0, function* () {
            const departments = yield department_service_1.departmentService.getDepartmentsForSlack(teamId);
            let filtered = departments.filter((department) => !!(department.label && (department.label.toLowerCase() === 'operations'
                || department.label.toLowerCase() === 'finance')));
            filtered.sort((a, b) => {
                if (a.label.toLowerCase() > b.label.toLowerCase())
                    return 1;
                return -1;
            });
            filtered = filtered.map((department) => ({
                name: department.head.name,
                email: department.head.email,
            }));
            return filtered;
        });
    }
    static getEmailReportAttachment() {
        return __awaiter(this, void 0, void 0, function* () {
            const report = new ReportGeneratorService_1.default(1);
            const tripData = yield report.generateMonthlyReport();
            const excelWorkBook = report.getEmailAttachmentFile(tripData);
            const attachment = yield ReportGeneratorService_1.default.writeAttachmentToStream(excelWorkBook);
            return attachment;
        });
    }
    static departmentToArray(departments) {
        const dept = Object.keys(departments);
        return dept.map((value) => (Object.assign({ name: value }, departments[value])));
    }
}
exports.default = MonthlyReportSender;
//# sourceMappingURL=monthlyReportSender.js.map