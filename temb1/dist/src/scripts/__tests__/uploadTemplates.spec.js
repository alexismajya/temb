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
const uploadTemplates_1 = __importDefault(require("../uploadTemplates"));
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
describe('UploadWeeklyTemplate', () => {
    beforeEach(() => {
        jest.spyOn(uploadTemplates_1.default, 'pushTemplates');
        uploadTemplates_1.default.client.post = (link, info) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve, reject) => resolve({ message: 'Template stored.' }));
        });
    });
    it('should upload weekly Template', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(console, 'log');
        jest.spyOn(uploadTemplates_1.default, 'readfile');
        yield uploadTemplates_1.default.uploadTemplate('../views/email/providersMonthlyReport.html', 'name', 'description');
        expect(uploadTemplates_1.default.client).toBeDefined();
        expect(console.log).toHaveBeenCalledWith('Template stored.');
        expect(uploadTemplates_1.default.readfile).toHaveBeenCalled();
    }));
    it('should upload read file Template', () => {
        const path = path_1.resolve(__dirname, '../../views/email/providersMonthlyReport.html');
        jest.spyOn(fs_1.default, 'readFileSync');
        uploadTemplates_1.default.readfile(path);
        expect(fs_1.default.readFileSync).toHaveBeenCalled();
    });
    it('should upload weekly template', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(uploadTemplates_1.default, 'uploadTemplate');
        yield uploadTemplates_1.default.weeklyTemplate();
        expect(uploadTemplates_1.default.uploadTemplate).toHaveBeenCalled();
    }));
    it('should upload providers monthly template', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(uploadTemplates_1.default, 'uploadTemplate');
        yield uploadTemplates_1.default.providerMonthlyReport();
        expect(uploadTemplates_1.default.uploadTemplate).toHaveBeenCalled();
    }));
});
//# sourceMappingURL=uploadTemplates.spec.js.map