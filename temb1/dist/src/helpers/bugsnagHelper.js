"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_express_1 = __importDefault(require("@bugsnag/plugin-express"));
const environment_1 = __importDefault(require("../config/environment"));
const js_1 = __importDefault(require("@bugsnag/js"));
class BugsnagLogger {
    constructor(env = environment_1.default) {
        this.env = env;
        this.NODE_ENV = env.NODE_ENV;
        const isTestOrDev = this.checkEnvironments();
        const apiKey = env.BUGSNAG_API_KEY;
        if (!isTestOrDev && apiKey) {
            this.bugsnagClient = js_1.default({
                apiKey,
                autoNotify: true,
                appVersion: '0.0.1',
                appType: 'web_server',
            });
            this.bugsnagClient.use(plugin_express_1.default);
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
            return this.bugsnagClient.getPlugin('express');
        }
        return false;
    }
    init(app) {
        if (this.middleware) {
            app.use(this.middleware.requestHandler);
        }
    }
    errorHandler(app) {
        if (this.middleware) {
            app.use(this.middleware.errorHandler);
        }
    }
    log(error) {
        if (this.bugsnagClient) {
            this.bugsnagClient.notify(error);
        }
        else if (!this.checkEnvironments(true)) {
            console.error('Error: ', error);
        }
    }
    warn(error) {
        return this.log(error);
    }
    info(error) {
        return this.log(error);
    }
    error(error) {
        return this.log(error);
    }
}
exports.BugsnagLogger = BugsnagLogger;
const bugsnagHelper = new BugsnagLogger();
exports.default = bugsnagHelper;
//# sourceMappingURL=bugsnagHelper.js.map