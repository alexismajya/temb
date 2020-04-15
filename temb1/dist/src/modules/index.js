"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apiSpec_1 = require("./apiSpec");
const routes_1 = __importDefault(require("./routes"));
const trips_1 = __importDefault(require("./trips"));
const slack_1 = __importDefault(require("./slack"));
const home_1 = __importDefault(require("./home"));
const users_1 = __importDefault(require("./users"));
const departments_1 = __importDefault(require("./departments"));
const addresses_1 = __importDefault(require("./addresses"));
const slackClientAuth_1 = __importDefault(require("../middlewares/slackClientAuth"));
const roleManagement_1 = __importDefault(require("./roleManagement"));
const authentication_1 = require("./authentication");
const ais_1 = __importDefault(require("./ais"));
const exports_1 = __importDefault(require("./exports"));
const cabs_1 = __importDefault(require("./cabs"));
const countries_1 = __importDefault(require("./countries"));
const fellows_1 = __importDefault(require("./fellows"));
const homebases_1 = __importDefault(require("./homebases"));
const locations_1 = __importDefault(require("./locations"));
const providers_1 = __importDefault(require("./providers"));
const drivers_1 = __importDefault(require("./drivers"));
const verify_provider_1 = __importDefault(require("./verify-provider"));
const apiPrefix = '/api/v1';
const apiDocsOptions = {
    customSiteTitle: 'Tembea API Documentation',
    customCss: '.swagger-ui .topbar { display: none }'
};
const routes = (app) => {
    app.use(home_1.default);
    apiSpec_1.setupSwaggerUI(app, '/api/v1/docs', apiSpec_1.v1JSDoc, apiDocsOptions);
    app.use(`${apiPrefix}/slack`, slackClientAuth_1.default, slack_1.default);
    app.use(apiPrefix, authentication_1.authenticationRouter);
    app.use(apiPrefix, ...authentication_1.authenticator);
    app.use(apiPrefix, verify_provider_1.default);
    app.use(apiPrefix, users_1.default);
    app.use(apiPrefix, addresses_1.default);
    app.use(apiPrefix, departments_1.default);
    app.use(apiPrefix, routes_1.default);
    app.use(apiPrefix, trips_1.default);
    app.use(apiPrefix, roleManagement_1.default);
    app.use(apiPrefix, routes_1.default);
    app.use(apiPrefix, countries_1.default);
    app.use(apiPrefix, ais_1.default);
    app.use(apiPrefix, cabs_1.default);
    app.use(apiPrefix, exports_1.default);
    app.use(apiPrefix, fellows_1.default);
    app.use(apiPrefix, homebases_1.default);
    app.use(apiPrefix, locations_1.default);
    app.use(apiPrefix, providers_1.default);
    app.use(apiPrefix, drivers_1.default);
    return app;
};
exports.default = routes;
//# sourceMappingURL=index.js.map