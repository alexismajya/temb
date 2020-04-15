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
const base_storage_1 = __importDefault(require("./base-storage"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const defaultDeps = { http: http_1.default, https: https_1.default, fs: fs_1.default };
class GoogleCloudStorageService extends base_storage_1.default {
    constructor(storage, bucketName = 'tembea', options = defaultDeps) {
        super(options.http, options.https, options.fs);
        this.bucketName = bucketName;
        this.bucket = storage.bucket(bucketName);
        this.baseUrl = 'https://storage.googleapis.com/';
    }
    getFile(folder, filename) {
        return __awaiter(this, void 0, void 0, function* () {
            const [{ name }] = yield this.bucket
                .file(`${folder}/${filename}`)
                .getMetadata();
            return `${this.baseUrl}${this.bucketName}/${name}`;
        });
    }
    saveRemoteFile(url, folder, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const filename = yield this.convertToImageAndSaveToLocal(url, './temp');
            const filePath = `${folder}/${fileName}`;
            yield this.bucket.upload(filename, {
                destination: filePath,
                gzip: true,
                metadata: {
                    cacheControl: 'public, max-age=31536000',
                },
            });
            yield this.removeFile(filename);
            return filePath;
        });
    }
    deleteFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield this.bucket.file(filePath)
                .delete();
            return deleted[0].statusCode;
        });
    }
}
exports.GoogleCloudStorageService = GoogleCloudStorageService;
//# sourceMappingURL=google-cloud-storage.js.map