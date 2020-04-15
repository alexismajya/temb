"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apiSpec_1 = require("./apiSpec");
const index_v2_1 = __importDefault(require("./routes/index.v2"));
const index_v2_2 = __importDefault(require("./trips/index.v2"));
const index_v2_3 = __importDefault(require("./shared/scheduler/index.v2"));
const apiV2Prefix = '/api/v2';
const apiDocsOptions = {
    customSiteTitle: 'Tembea API Documentation',
    customCss: '.swagger-ui .topbar { display: none }'
};
const routes = (app) => {
    app.use(apiV2Prefix, index_v2_2.default);
    app.use(apiV2Prefix, index_v2_1.default);
    app.use(apiV2Prefix, index_v2_3.default);
    apiSpec_1.setupSwaggerUI(app, '/api/v2/docs', apiSpec_1.v2JSDoc, apiDocsOptions);
    return app;
};
exports.default = routes;
//# sourceMappingURL=index.v2.js.map