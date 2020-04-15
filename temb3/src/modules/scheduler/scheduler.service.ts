import Bull from 'bull';
import moment from 'moment';
import request from 'request';
import {
  IJobData,
  IRequestOptions,
  IScheduleRequest,
} from '../../interfaces/schedul-request.interface';
import SchedulerHelper from '../../helpers/scheduler-helpers';
import { IClientData } from '../../interfaces/client-data.interface';
import redisClient from '../../config/redis';
import redisCache, { RedisCache } from '../../cache/redis-cache';
import Redis from 'ioredis';
import environment from '../../config/environment';

export const appDefaultQueue = 'app_queue';

export interface ISchedulerAuth {
  clientId: string;
  clientSecret: string;
}

export interface IJobRecord {
  id: string;
  name: string;
}

export class SchedulerService {
  static reccurringJob(
    isSequential: boolean,
    repeatTime: string,
    repeatSequence: string,
  ): Bull.JobOptions {
    let rule: Bull.JobOptions = {};
    if (isSequential) {
      const repeatDuration: number = SchedulerHelper.getRepeatTime(
        repeatSequence,
      );
      rule = { repeat: { every: repeatDuration } };
    } else {
      const cronPattern = SchedulerHelper.generateCron(repeatTime);
      rule = { repeat: { cron: cronPattern } };
    }
    return rule;
  }

  static singleJob(time: string): Bull.JobOptions {
    const timeLeft = moment(time).diff(moment());
    return { delay: timeLeft < 1000 ? 1000 : timeLeft };
  }

  static generateRule(data: IScheduleRequest): Bull.JobOptions {
    const { isRecurring, timeZone, time, cron } = data;
    let rule: Bull.JobOptions = {};
    if (isRecurring) {
      const { repeatTime, isSequential, repeatSequence } = cron;
      rule = SchedulerService.reccurringJob(
        isSequential,
        repeatTime,
        repeatSequence,
      );
      rule.repeat = { ...rule.repeat, tz: timeZone };
    } else {
      rule = SchedulerService.singleJob(time);
    }
    return rule;
  }

  private readonly queue: Bull.Queue;

  constructor(
    private readonly cache: RedisCache,
    private readonly rdClient: { createClient(type?: string): Redis.Redis },
  ) {
    this.queue = new Bull(appDefaultQueue, environment.REDIS_URL);
    this.queue.process('*', this.jobProcessor);
  }

  async getOneJob(id: any) {
    const job: Bull.Job = await this.queue.getJob(id);
    return job;
  }

  async getJobByKey(key: string) {
    let job: Bull.Job;
    const record = await this.cache.fetchObject<IJobRecord>(key);
    if (record) {
      job = await this.getOneJob(record.id);
      return job;
    }
    return null;
  }

  public async getAllQueues() {
    const queueNameRegExp = new RegExp('(.*):(.*):id');
    const keys = await this.rdClient.createClient().keys('*:*:id');
    const queues = keys.map((key) => {
      const match = queueNameRegExp.exec(key);
      if (match) {
        return {
          prefix: match[1],
          name: match[2],
          hostId: `${match[2].toUpperCase()} Jobs`,
          url: environment.REDIS_URL,
        };
      }
    });
    return queues;
  }

  /**
   * @description Create a job in the scheduler
   * @param {object} req The Http request object
   * @param {object} res The Http response object
   */
  public async createJob(data: IScheduleRequest, clientId: string) {
    const { payload } = data;
    const rule = SchedulerService.generateRule(data);
    const jobData: IJobData = { ...payload, clientId };
    const job = await this.addJobToQueue(jobData, rule);

    await this.cache.saveObject(data.payload.key, {
      id: job.id,
      name: job.name,
    });
    const message: string = 'Job Succesfully created';
    return { message, job };
  }

  public async deleteJob(key: string) {
    const job = await this.getJobByKey(key);
    if (job) {
      job.remove();
      return {
        isRemoved: true,
        message: 'The job is removed successfully',
      };
    }
    return {
      isRemoved: false,
      message: 'Could not find the job with such key',
    };
  }

  /**
   * @description Add new job to existing or new queue
   * @param {IJobData} jobData The data associated with a job
   * @param {Bull.JobOptions} rule The rules specific to that job
   */
  private async addJobToQueue(
    jobData: IJobData,
    rule: Bull.JobOptions,
  ): Promise<Bull.Job> {
    const findJob = await this.getJobByKey(jobData.key);
    if (findJob) {
      await this.deleteJob(jobData.key);
      const newJob: Bull.Job = await this.queue.add(jobData.key, jobData, rule);
      return newJob;
    }
    const job: Bull.Job = await this.queue.add(jobData.key, jobData, rule);
    return job;
  }

  private createQueue = (queueName: string) => {
    const theQueue = new Bull(queueName, this.rdClient);
    return theQueue;
  }

  private jobProcessor = async (
    job: Bull.Job,
    done: Bull.DoneCallback,
    retry: number = 3,
  ) => {
    const jobData: IJobData = job.data;
    if (!jobData) { done(); return; }
    const { callbackUrl, args, clientId } = jobData;
    const client = await this.cache.fetchObject<IClientData>(clientId);
    if (!client) { done(); return; }
    const clientSecret: string = client.clientSecret;
    const options: IRequestOptions = {
      url: callbackUrl,
      body: args,
      headers: {
        'scheduler-secret': clientSecret,
      },
      json: true,
    };

    await new Promise((resolve, reject) =>
      request.post(options, async (error, res) => {
        if (error && retry > 0) {
          await this.jobProcessor(job, done, retry - 1);
        }
        if (error && retry < 1) {
          reject(error);
        }
        resolve(res);
      }),
    );

    done();
  }
}

const schedulerService = new SchedulerService(redisCache, redisClient);
export default schedulerService;
