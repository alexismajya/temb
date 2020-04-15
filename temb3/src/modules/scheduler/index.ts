import express, { Request, Response } from 'express';
import middleware from '../../middlewares';
import schedulerController, { SchedulerController } from './scheduler.controller';

const { SchedulerValidator, AuthValidator } = middleware;

const schedulerRouter = express.Router();

export const handle = (handler: (...args: any[]) => any | Promise<any>, scope: any) => {
  return (req: Request, res: Response, next: any) => {
    return handler.call(scope, req, res, next);
  };
};

schedulerRouter.use('/jobs', AuthValidator.authenticateClient);

schedulerRouter.post('/jobs',
  SchedulerValidator.validateInputs, handle(schedulerController.addJob, schedulerController),
);

schedulerRouter.delete(
  '/jobs/:key',
  schedulerController.deleteJob,
);

export default schedulerRouter;
