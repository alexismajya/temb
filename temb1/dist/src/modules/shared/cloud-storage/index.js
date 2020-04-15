"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const storage_1 = require("@google-cloud/storage");
const google_cloud_storage_1 = require("./google-cloud-storage");
const googleStorageOptions = {
    projectId: process.env.GCS_PROJECT_ID,
    keyFilename: process.env.GCS_APP_CREDENTIALS,
    bucketName: process.env.GCS_BUCKET_NAME,
};
exports.googleCloudStorage = new google_cloud_storage_1.GoogleCloudStorageService(new storage_1.Storage(googleStorageOptions), googleStorageOptions.bucketName);
exports.abotherStorageEngine = {};
//# sourceMappingURL=index.js.map