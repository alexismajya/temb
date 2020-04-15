import { Application } from 'express';
import AuthRouter from './auth';
import SchedulerRouter from './scheduler';

const apiPrefix = '/api/v1';

const routes = (app: Application) => {
    app.use(apiPrefix, SchedulerRouter);
    app.use(apiPrefix, AuthRouter);
    return app;
};

export default routes;
