import SchedulerController from '../scheduler.controller';
import mockSchedulerService from './scheduler.service';

const schedulerController = new SchedulerController(mockSchedulerService);

export default schedulerController;
