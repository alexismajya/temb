import { Request, Response } from 'express';
import { SchedulerService } from './scheduler.service';

export default class SchedulerController {
  constructor(private readonly scheduler: SchedulerService) { }

  handle = (req: Request, res: Response) => {
    this.scheduler.handleJob(req.body);
    res.send('done');
  }
}
