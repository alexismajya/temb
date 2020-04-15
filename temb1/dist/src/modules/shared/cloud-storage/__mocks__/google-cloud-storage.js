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
class MockGCSFile {
    constructor(name) {
        this.name = name;
        this.metadata = { name };
        this.message = true;
    }
    getMetadata() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve([this.metadata]);
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve([{ statusCode: 200 }]);
        });
    }
}
class MockGCSBucket {
    constructor(name) {
        this.name = name;
        this.name = name;
        this.files = {};
        this.message = true;
    }
    file(path) {
        return this.files[path] || (this.files[path] = new MockGCSFile(path));
    }
    upload() {
        return this.message;
    }
}
exports.MockGCSBucket = MockGCSBucket;
exports.mockGCStorage = {
    bucket: (name) => new MockGCSBucket(name),
};
exports.mockGCSService = new google_cloud_storage_1.GoogleCloudStorageService(exports.mockGCStorage, 'tembea');
//# sourceMappingURL=google-cloud-storage.js.map