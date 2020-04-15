import { Router, Request, Response, NextFunction } from 'express';
import SchedulerController from './scheduler.controller';
import env from '../../../config/environment';
import schedulerService from '.';

const sharedRouter = Router();

const validateCallback = (req: Request, res: Response, next: NextFunction) => {
  const secret = req.headers['scheduler-secret'];
  if (env.SCHEDULER_CLIENT_SECRET !== secret) { return; }
  next();
};

const schedulerController = new SchedulerController(schedulerService);

sharedRouter.post('/jobhandler', validateCallback,
  schedulerController.handle.bind(schedulerController));

export default sharedRouter;
