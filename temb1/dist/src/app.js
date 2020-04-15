"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const bugsnagHelper_1 = __importDefault(require("./helpers/bugsnagHelper"));
const modules_1 = __importDefault(require("./modules"));
const index_v2_1 = __importDefault(require("./modules/index.v2"));
require("./modules/slack/events/index");
const hbsConfig_1 = __importDefault(require("./hbsConfig"));
const app = express_1.default();
bugsnagHelper_1.default.init(app);
app.use(cors_1.default());
if (app.get('env') !== 'test') {
    app.use(morgan_1.default('dev'));
}
app.use(express_1.default.urlencoded({
    limit: '50mb',
    extended: true,
    verify: (req, res, buf) => { req.rawBody = buf; },
}));
app.use(express_1.default.json({
    verify: (req, res, buf) => { req.rawBody = buf; }
}));
app.use('/assets', express_1.default.static(path_1.default.join(__dirname, 'assets')));
app.set('views', path_1.default.join(__dirname, 'views'));
exports.hbs = hbsConfig_1.default(app);
app.engine('html', exports.hbs.engine);
app.set('view engine', 'html');
modules_1.default(app);
index_v2_1.default(app);
app.use('*', (req, res) => res.status(404).json({
    message: 'Not Found. Use /api/v1 or /api/v2 to access the api'
}));
bugsnagHelper_1.default.errorHandler(app);
exports.default = app;
//# sourceMappingURL=app.js.map