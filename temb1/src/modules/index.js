import { setupSwaggerUI, v1JSDoc } from './apiSpec';
import routesRouter from './routes';
import tripsRouter from './trips';
import slackRouter from './slack';
import homeRouter from './home';
import userRouter from './users';
import departmentRouter from './departments';
import addressRouter from './addresses';
import slackClientAuth from '../middlewares/slackClientAuth';
import roleManagementRouter from './roleManagement';
import { authenticationRouter, authenticator } from './authentication';
import aisRouter from './ais';
import exportsRouter from './exports';
import cabsRouter from './cabs';
import countryRouter from './countries';
import fellowsRouter from './fellows';
import homebaseRouter from './homebases';
import locationRouter from './locations';
import providerRouter from './providers';
import driverRouter from './drivers';
import verifyProviderRouter from './verify-provider';

const apiPrefix = '/api/v1';

const apiDocsOptions = {
  customSiteTitle: 'Tembea API Documentation',
  customCss: '.swagger-ui .topbar { display: none }'
};

const routes = (app) => {
  app.use(homeRouter);
  setupSwaggerUI(app, '/api/v1/docs', v1JSDoc, apiDocsOptions);
  app.use(`${apiPrefix}/slack`, slackClientAuth, slackRouter);
  app.use(apiPrefix, authenticationRouter);
  app.use(apiPrefix, ...authenticator);
  app.use(apiPrefix, verifyProviderRouter);
  app.use(apiPrefix, userRouter);
  app.use(apiPrefix, addressRouter);
  app.use(apiPrefix, departmentRouter);
  app.use(apiPrefix, routesRouter);
  app.use(apiPrefix, tripsRouter);
  app.use(apiPrefix, roleManagementRouter);
  app.use(apiPrefix, routesRouter);
  app.use(apiPrefix, countryRouter);
  app.use(apiPrefix, aisRouter);
  app.use(apiPrefix, cabsRouter);
  app.use(apiPrefix, exportsRouter);
  app.use(apiPrefix, fellowsRouter);
  app.use(apiPrefix, homebaseRouter);
  app.use(apiPrefix, locationRouter);
  app.use(apiPrefix, providerRouter);
  app.use(apiPrefix, driverRouter);
  return app;
};

export default routes;
