import Arena from 'bull-arena';
import { Request, Response } from 'express';
import ResponseHelper from '../../helpers/response-helper';
import schedulerService, { SchedulerService } from './scheduler.service';

let arena: any = null;

interface ISchedulerHeaders {
  [key: string]: string;
}
export class SchedulerController {
  constructor(private readonly scheduler: SchedulerService) {}

  async addJob(req: Request, res: Response) {
    const { 'client-id': clientId } = req.headers as ISchedulerHeaders;
    const result = await this.scheduler.createJob(req.body, clientId);
    return ResponseHelper.sendResponse(
      res,
      201,
      true,
      result.message,
      result.job
    );
  }
  async deleteJob(req: Request, res: Response) {

    const {
  params: { key },
    } = req;
    const job = await schedulerService.deleteJob(key);
    const { message, isRemoved } = job;
    if (isRemoved) {
      return ResponseHelper.sendResponse(res, 201, true, message);
    }
    return ResponseHelper.sendResponse(res, 404, false, message);

  }
  async viewJobs(req: Request, res: Response, next: any) {
    if (!arena) {
      const queues = await this.scheduler.getAllQueues();
      arena = Arena({ queues });
    }
    return arena(req, res, next);
  }
}

const schedulerController = new SchedulerController(schedulerService);

export default schedulerController;
