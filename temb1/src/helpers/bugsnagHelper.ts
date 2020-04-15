import bugsnagExpress from '@bugsnag/plugin-express';
import environment from '../config/environment';
import bugsnag, { Bugsnag } from '@bugsnag/js';
import ILogger from '../modules/shared/logging/logger.interface';
import express from 'express';

export class BugsnagLogger implements ILogger {
  private readonly bugsnagClient: Bugsnag.Client;
  private readonly NODE_ENV: string;

  constructor(private readonly env = environment) {
    this.NODE_ENV = env.NODE_ENV;
    const isTestOrDev = this.checkEnvironments();
    const apiKey = env.BUGSNAG_API_KEY;

    if (!isTestOrDev && apiKey) {
      /* istanbul ignore next */
      this.bugsnagClient = bugsnag({
        apiKey,
        autoNotify: true,
        appVersion: '0.0.1',
        appType: 'web_server',
      });

      this.bugsnagClient.use(bugsnagExpress);
    }
  }

  checkEnvironments(isTest = false) {
    const environments = ['test', 'development'];
    return isTest
      ? ['test', 'testing'].includes(this.NODE_ENV)
      : environments.includes(this.NODE_ENV);
  }

  get middleware() {
    if (this.bugsnagClient) {
      /* istanbul ignore next */
      return this.bugsnagClient.getPlugin('express');
    }
    return false;
  }

  init(app: express.Application) {
    if (this.middleware) {
      app.use(this.middleware.requestHandler);
    }
  }

  errorHandler(app: express.Application) {
    if (this.middleware) {
      app.use(this.middleware.errorHandler);
    }
  }

  log(error: Error) {
    if (this.bugsnagClient) {
      this.bugsnagClient.notify(error);
    } else if (!this.checkEnvironments(true)) {
      // eslint-disable-next-line no-console
      console.error('Error: ', error);
    }
  }

  warn(error: Error) {
    return this.log(error);
  }

  info(error: Error) {
    return this.log(error);
  }

  error(error: Error) {
    return this.log(error);
  }
}

const bugsnagHelper = new BugsnagLogger();
export default bugsnagHelper;
