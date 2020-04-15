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
const url_1 = __importDefault(require("url"));
const https_1 = __importDefault(require("https"));
const http_1 = __importDefault(require("http"));
const uuid_1 = __importDefault(require("uuid"));
const fs_1 = __importDefault(require("fs"));
class BaseCloudStorage {
    constructor(httpClient = http_1.default, httpsClient = https_1.default, fsNode = fs_1.default) {
        this.httpClient = httpClient;
        this.httpsClient = httpsClient;
        this.fsNode = fsNode;
    }
    createDirectory(dir) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.fsNode.exists(dir, (exists) => {
                    if (!exists) {
                        this.fsNode.mkdir(dir, (err) => {
                            if (err)
                                reject(err);
                            resolve();
                        });
                    }
                    resolve();
                });
            });
        });
    }
    removeFile(fileDir) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.fsNode.unlink(fileDir, (err) => {
                    if (err)
                        reject(err);
                    resolve();
                });
            });
        });
    }
    convertToImageAndSaveToLocal(uri, destination) {
        return __awaiter(this, void 0, void 0, function* () {
            const theUrl = url_1.default.parse(uri);
            if (!theUrl.host)
                throw new Error('Requested URL is invalid');
            const client = (theUrl.protocol === 'https:') ? this.httpsClient : this.httpClient;
            yield this.createDirectory(destination);
            const filename = uuid_1.default();
            return new Promise((resolve, reject) => {
                const fileDir = `${destination}/${filename}`;
                const file = this.fsNode.createWriteStream(fileDir);
                client.get(uri, (response) => {
                    response.pipe(file);
                    file.on('finish', () => {
                        file.close();
                        resolve(file.path);
                    });
                }).on('error', (err) => {
                    this.fsNode.unlink(fileDir, () => { });
                    reject(err);
                });
            });
        });
    }
}
exports.default = BaseCloudStorage;
//# sourceMappingURL=base-storage.js.map