import url from 'url';
import https from 'https';
import http from 'http';
import uuid from 'uuid';
import fs from 'fs';

export default abstract class BaseCloudStorage {
  constructor(
    private readonly httpClient = http,
    private readonly httpsClient = https,
    private readonly fsNode = fs,
  ) { }
   /**
    * @static createDirectory
    * @description This function create directory to store dowloaded files
    * @param  {string} dir the file directory to create
    * @returns {void}.
  */
  async createDirectory(dir: string) {
    return new Promise((resolve, reject) => {
      this.fsNode.exists(dir, (exists) => {
        if (!exists) {
          this.fsNode.mkdir(dir, (err) => {
            if (err) reject(err);
            resolve();
          });
        }
        resolve();
      });
    });
  }

  async removeFile(fileDir: string) {
    return new Promise((resolve, reject) => {
      this.fsNode.unlink(fileDir, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

   /**
    * @static convertToImageAndSaveToLocal
    * @description This function convert the google map image url into a jpeg file
    * @param  {string} uri of the google map image url
    * @param  {string} destination - location to save the image
    * @returns {string} Save.
    */
  async convertToImageAndSaveToLocal(uri: string, destination: string) {
    const theUrl = url.parse(uri);
    if (!theUrl.host) throw new Error('Requested URL is invalid');
    const client = (theUrl.protocol === 'https:') ? this.httpsClient : this.httpClient;
    await this.createDirectory(destination);
    const filename = uuid();
    return new Promise<string>((resolve, reject) => {
      const fileDir = `${destination}/${filename}`;
      const file = this.fsNode.createWriteStream(fileDir);
      client.get(uri, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(file.path as string);
        });
      }).on('error', (err) => {
        this.fsNode.unlink(fileDir, () => {});
        reject(err);
      });
    });
  }
}
