import express from 'express';
import morgan from 'morgan';
import modules from './modules';
import schedulerService, { appDefaultQueue } from './modules/scheduler/scheduler.service';
import schedulerController from './modules/scheduler/scheduler.controller';
import Arena from 'bull-arena';
import env from './config/environment';
import { handle } from './modules/scheduler';

const app: express.Application = express();

app.use(morgan('dev'));
app.use(
  express.urlencoded({
    limit: '50mb',
    extended: true,
  }),
);
app.use(express.json());

modules(app);

app.use('/jobs', handle(schedulerController.viewJobs, schedulerController));

// catch all routers
app.use('*', (req, res) =>
  res.status(404).json({
    message: 'Not Found. Use /api/v1 to access the api',
  }),
);

export default app;
