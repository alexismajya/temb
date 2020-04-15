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
Object.defineProperty(exports, "__esModule", { value: true });
const google_cloud_storage_1 = require("../google-cloud-storage");
const google_cloud_storage_2 = require("../__mocks__/google-cloud-storage");
describe(google_cloud_storage_1.GoogleCloudStorageService, () => {
    let gcsService;
    beforeAll(() => {
        gcsService = new google_cloud_storage_1.GoogleCloudStorageService(google_cloud_storage_2.mockGCStorage);
    });
    it('should be instantiated', () => {
        expect(gcsService).toBeDefined();
    });
    describe(google_cloud_storage_1.GoogleCloudStorageService.prototype.getFile, () => {
        it('should get file from google cloud', () => __awaiter(void 0, void 0, void 0, function* () {
            const testArgs = {
                folder: 'uploded',
                file: 'files/images.jpeg',
            };
            const expectedUrl = `https://storage.googleapis.com/tembea/${testArgs.folder}`;
            const result = yield gcsService.getFile(testArgs.folder, testArgs.file);
            expect(result).toContain(expectedUrl);
        }));
    });
    describe(google_cloud_storage_1.GoogleCloudStorageService.prototype.saveRemoteFile, () => {
        it('should save file to google cloud', () => __awaiter(void 0, void 0, void 0, function* () {
            const testArgs = {
                url: 'https://avatars0.githubusercontent.com/u/44836329?s=60&v=4',
                folder: 'uploded',
                fileName: 'files/images.jpeg',
            };
            const result = yield gcsService.saveRemoteFile(testArgs.url, testArgs.folder, testArgs.fileName);
            expect(result).toBe(`${testArgs.folder}/${testArgs.fileName}`);
        }));
    });
    describe(google_cloud_storage_1.GoogleCloudStorageService.prototype.deleteFile, () => {
        it('should delete file from google cloud', () => __awaiter(void 0, void 0, void 0, function* () {
            const testFilePath = './files/images.jpeg';
            const result = yield gcsService.deleteFile(testFilePath);
            expect(result).toBe(200);
        }));
    });
});
//# sourceMappingURL=google-cloud-storage.spec.js.map