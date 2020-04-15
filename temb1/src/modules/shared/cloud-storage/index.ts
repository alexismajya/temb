import { Storage } from '@google-cloud/storage';
import { GoogleCloudStorageService, IGoogleCloudStorageOptions } from './google-cloud-storage';

const googleStorageOptions: IGoogleCloudStorageOptions = {
  projectId: process.env.GCS_PROJECT_ID,
  keyFilename: process.env.GCS_APP_CREDENTIALS,
  bucketName: process.env.GCS_BUCKET_NAME,
};

export const googleCloudStorage = new GoogleCloudStorageService(
  new Storage(googleStorageOptions), googleStorageOptions.bucketName,
);

export const abotherStorageEngine = { };
