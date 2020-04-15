import { Storage, Bucket } from '@google-cloud/storage';
import BaseCloudStorage from './base-storage';
import http from 'http';
import https from 'https';
import fs from 'fs';

export interface IGoogleCloudStorageOptions {
  projectId: string;
  keyFilename: string;
  bucketName: string;
}

export interface IGCSDependencies {
  http: typeof http;
  https: typeof https;
  fs: typeof fs;
}

const defaultDeps = { http, https, fs };

export class GoogleCloudStorageService extends BaseCloudStorage {
  private readonly bucket: Bucket;
  private readonly baseUrl: string;

  constructor(
    storage: Storage,
    private readonly bucketName = 'tembea',
    options: IGCSDependencies = defaultDeps) {
    super(options.http, options.https, options.fs);
    this.bucket = storage.bucket(bucketName);
    this.baseUrl = 'https://storage.googleapis.com/';
  }

  async getFile(folder: string, filename: string) {
    const [{ name }] = await this.bucket
      .file(`${folder}/${filename}`)
      .getMetadata();
    return `${this.baseUrl}${this.bucketName}/${name}`;
  }

  async saveRemoteFile(url: string, folder: string, fileName: string) {
    const filename = await this.convertToImageAndSaveToLocal(url, './temp');
    const filePath = `${folder}/${fileName}`;
    await this.bucket.upload(filename, {
      destination: filePath,
      gzip: true,
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    });
    await this.removeFile(filename);
    return filePath;
  }

  async deleteFile(filePath: string) {
    const deleted = await this.bucket.file(filePath)
      .delete();
    return deleted[0].statusCode;
  }
}
