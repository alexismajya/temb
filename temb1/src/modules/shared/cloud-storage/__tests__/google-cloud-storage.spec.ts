import { GoogleCloudStorageService } from '../google-cloud-storage';
import { mockGCStorage } from '../__mocks__/google-cloud-storage';

describe(GoogleCloudStorageService, () => {
  let gcsService: GoogleCloudStorageService;

  beforeAll(() => {
    gcsService = new GoogleCloudStorageService(mockGCStorage);
  });

  it('should be instantiated', () => {
    expect(gcsService).toBeDefined();
  });

  describe(GoogleCloudStorageService.prototype.getFile, () => {
    it('should get file from google cloud', async () => {
      const testArgs = {
        folder: 'uploded',
        file: 'files/images.jpeg',
      };

      const expectedUrl = `https://storage.googleapis.com/tembea/${testArgs.folder}`;

      const result = await gcsService.getFile(testArgs.folder, testArgs.file);

      expect(result).toContain(expectedUrl);
    });
  });

  describe(GoogleCloudStorageService.prototype.saveRemoteFile, () => {
    it('should save file to google cloud', async () => {
      const testArgs = {
        url: 'https://avatars0.githubusercontent.com/u/44836329?s=60&v=4',
        folder: 'uploded',
        fileName: 'files/images.jpeg',
      };

      const result = await gcsService.saveRemoteFile(testArgs.url, testArgs.folder,
        testArgs.fileName);

      expect(result).toBe(`${testArgs.folder}/${testArgs.fileName}`);
    });
  });

  describe(GoogleCloudStorageService.prototype.deleteFile, () => {
    it('should delete file from google cloud', async () => {
      const testFilePath = './files/images.jpeg';
      const result = await gcsService.deleteFile(testFilePath);

      expect(result).toBe(200);
    });
  });
});
