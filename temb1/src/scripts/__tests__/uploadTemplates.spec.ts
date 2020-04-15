import uploadTemplates from '../uploadTemplates';
import fs from 'fs';
import { resolve } from 'path';

describe('UploadWeeklyTemplate', () => {
  beforeEach(() => {
    jest.spyOn(uploadTemplates, 'pushTemplates');
    uploadTemplates.client.post = async (link: string, info: any) =>  new Promise(
      (resolve, reject) => resolve({ message: 'Template stored.' }));
  });

  it('should upload weekly Template', async () => {
    jest.spyOn(console, 'log');
    jest.spyOn(uploadTemplates, 'readfile');
    await uploadTemplates.uploadTemplate(
      '../views/email/providersMonthlyReport.html',
      'name',
      'description');
    expect(uploadTemplates.client).toBeDefined();
    expect(console.log).toHaveBeenCalledWith('Template stored.');
    expect(uploadTemplates.readfile).toHaveBeenCalled();
  });

  it('should upload read file Template', () => {
    const path = resolve(__dirname, '../../views/email/providersMonthlyReport.html');
    jest.spyOn(fs, 'readFileSync');
    uploadTemplates.readfile(path);
    expect(fs.readFileSync).toHaveBeenCalled();
  });

  it('should upload weekly template', async () => {
    jest.spyOn(uploadTemplates, 'uploadTemplate');
    await uploadTemplates.weeklyTemplate();
    expect(uploadTemplates.uploadTemplate).toHaveBeenCalled();
  });

  it('should upload providers monthly template', async () => {
    jest.spyOn(uploadTemplates, 'uploadTemplate');
    await uploadTemplates.providerMonthlyReport();
    expect(uploadTemplates.uploadTemplate).toHaveBeenCalled();
  });
});
