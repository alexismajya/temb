import { Storage, Bucket } from '@google-cloud/storage';
import { GoogleCloudStorageService } from '../google-cloud-storage';

class MockGCSFile {
  metadata: { name: string; };
  message: boolean;
  constructor(private readonly name: string) {
    this.metadata = { name };
    this.message = true;
  }

  async getMetadata() {
    return Promise.resolve([this.metadata]);
  }

  async delete() {
    return Promise.resolve([{ statusCode: 200 }]);
  }
}

export class MockGCSBucket {
  message: boolean;
  files: { [key: string]: any };
  constructor(private readonly name: string) {
    this.name = name;
    this.files = {};
    this.message = true;
  }

  file(path: string) {
    return this.files[path] || (this.files[path] = new MockGCSFile(path));
  }

  upload() {
    return this.message;
  }
}

export const mockGCStorage = {
  bucket: (name: string) => new MockGCSBucket(name) as unknown as Bucket,
} as Storage;

export const mockGCSService = new GoogleCloudStorageService(mockGCStorage, 'tembea');
