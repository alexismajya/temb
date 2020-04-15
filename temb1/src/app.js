import express from 'express';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import BugsnagHelper from './helpers/bugsnagHelper';
import modules from './modules';
import modulesV2 from './modules/index.v2';
import './modules/slack/events/index';
import hbsConfig from './hbsConfig';


const app = express();

/* This must be the first piece of middleware in the stack.
   It can only capture errors in downstream middleware */
BugsnagHelper.init(app);

app.use(cors());
if (app.get('env') !== 'test') {
  app.use(morgan('dev'));
}

app.use(express.urlencoded({
  limit: '50mb',
  extended: true,
  verify: (req, res, buf) => { req.rawBody = buf; },
}));

app.use(express.json({
  verify: (req, res, buf) => { req.rawBody = buf; }
}));

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.set('views', path.join(__dirname, 'views'));

export const hbs = hbsConfig(app);
app.engine('html', hbs.engine);
app.set('view engine', 'html');

// set base url for api
modules(app);
modulesV2(app);

// catch all routers
app.use('*', (req, res) => res.status(404).json({
  message: 'Not Found. Use /api/v1 or /api/v2 to access the api'
}));

/* This handles any errors that Express catches,
   it should come last in the pipeline */
BugsnagHelper.errorHandler(app);

export default app;
