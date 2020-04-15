import bugsnag from '@bugsnag/js';
import { BugsnagErrorHandler } from '@bugsnag/plugin-angular';
import { environment } from 'src/environments/environment';
var bugsnagKey = environment.BUGSNAG_API_KEY;
var bugsnagClient = bugsnag(bugsnagKey);
export var errorHandlerFactory = function () {
    return new BugsnagErrorHandler(bugsnagClient);
};
//# sourceMappingURL=bugsnag.service.js.map