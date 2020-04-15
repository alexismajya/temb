import supertest from 'supertest';
import app from '../../../app';
import redisCache from '../../../cache/redis-cache';
import { mockJobObject } from '../__mocks__/mock-data';

const request = supertest(app);
const url = '/api/v1/jobs';

describe('SchedulerController', () => {
  let headers: object;

  beforeEach(() => {
    headers = {
      'Accept': 'application/json',
      'client-id': 'tem',
      'client-secret': 'xmnxnxnxn',
    };
    jest
      .spyOn(redisCache, 'fetchObject')
      .mockResolvedValue({ clientId: 'tem', clientSecret: 'xmnxnxnxn' });
  });
  afterAll(() => {
    jest.resetAllMocks();
  });

  describe('UnAuthenticated user', () => {
    it('should check user has a valid secret key', async (done) => {
      const res = await request.post(url).send(mockJobObject.isReccurringFalse);
      expect(res.body.message).toEqual(
        'Please Provide client-id and client-secret',
      );
      done();
    });
    it('should check user has a valid secret key', async (done) => {
      const res = await request
        .post(url)
        .send(mockJobObject.isReccurringFalse)
        .set({ 'client-id': 'tem', 'client-secret': 'xmnx' });
      expect(res.status).toEqual(401);
      expect(res.body.message).toEqual('Unknown client');
      done();
    });
  });
  describe('validate user input', () => {
    it('should respond with time is required', async (done) => {
      const res = await request
        .post(url)
        .send(mockJobObject.noTimeMock)
        .set(headers);
      expect(res.status).toEqual(400);
      expect(res.body.message).toEqual(
        'Validation error occurred, see error object for details',
      );
      expect(res.body.error.time).toEqual('Please provide time');
      done();
    });

    it('should fail if isReccuring is false and time is not provided', async (done) => {
      const res = await request
        .post(url)
        .send(mockJobObject.isReccurringFalse)
        .set(headers);
      expect(res.status).toEqual(400);
      expect(res.body.message).toEqual(
        'Validation error occurred, see error object for details',
      );
      expect(res.body.error.time).toEqual('Please provide time');
      done();
    });
    it('should fail cron is not provided', async (done) => {
      const res = await request
        .post(url)
        .send(mockJobObject.noCronMock)
        .set(headers);
      expect(res.status).toEqual(400);
      expect(res.body.message).toEqual(
        'Validation error occurred, see error object for details',
      );
      expect(res.body.error.cron).toEqual('Please provide cron');
      done();
    });
    it(`should fail if time is not in 'DD-MM : HH:mm' format`, async (done) => {
      const res = await request
        .post(url)
        .send(mockJobObject.wrongFormatTime)
        .set(headers);
      expect(res.status).toEqual(400);
      expect(res.body.message).toEqual(
        'Validation error occurred, see error object for details',
      );
      expect(res.body.error.time).toEqual(
        `time must be in the ISO-8601 format`,
      );
      done();
    });
  });

  describe('Create job', () => {
    it('should create a one time job', async (done) => {
      const res = await request
        .post(url)
        .send(mockJobObject.singleJobMock)
        .set(headers);
      expect(res.status).toEqual(201);
      expect(res.body.message).toEqual('Job Succesfully created');
      done();
    });

    it('should create a repeatable job', async (done) => {
      const res = await request
        .post(url)
        .send(mockJobObject.repeatableJobMock)
        .set(headers);
      expect(res.status).toEqual(201);
      expect(res.body.message).toEqual('Job Succesfully created');
      done();
    });

    it('should create a sequential job', async (done) => {
      const res = await request
        .post(url)
        .send(mockJobObject.sequentialJobMock)
        .set(headers);
      expect(res.status).toEqual(201);
      expect(res.body.message).toEqual('Job Succesfully created');
      done();
    });
  });
});
