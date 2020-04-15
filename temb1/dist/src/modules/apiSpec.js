"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const getDefinition = (version) => ({
    info: {
        title: 'Tembea API Docs',
        version: `${version}.0.0`,
        description: `Docs for the Tembea API (v${version})`
    },
    schemes: ['http', 'https'],
    basePath: `/api/v${version}/`,
    produces: ['application/json'],
    consumes: ['application/json'],
    securityDefinitions: {
        JWT: {
            type: 'apiKey',
            name: 'authorization',
            in: 'header'
        }
    },
    security: [{ JWT: [] }]
});
exports.v1JSDoc = swagger_jsdoc_1.default({
    swaggerDefinition: getDefinition(1),
    apis: ['./**/index.js']
});
exports.v2JSDoc = swagger_jsdoc_1.default({
    swaggerDefinition: getDefinition(2),
    apis: ['./**/index.v2.js']
});
exports.setupSwaggerUI = (app, url, spec, options) => {
    app.use(url, swagger_ui_express_1.default.serve, swagger_ui_express_1.default.serveFiles(spec, options));
    app.get(url, (req, res) => {
        res.send(swagger_ui_express_1.default.generateHTML(spec, options));
    });
};
//# sourceMappingURL=apiSpec.js.map