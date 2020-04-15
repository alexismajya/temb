"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_promise_native_1 = __importDefault(require("request-promise-native"));
const teamDetails_service_1 = require("../teamDetails/teamDetails.service");
const bugsnagHelper_1 = __importDefault(require("../../helpers/bugsnagHelper"));
exports.SlackInstallUrl = `https://slack.com/oauth/authorize?client_id=${process.env.SLACK_CLIENT_ID}&scope=commands,groups:read,im:write,team:read,users.profile:read,users:read.email,users:read,bot`;
class HomeController {
    static index(req, res) {
        res.render('home/index.html', {
            title: 'Welcome to Tembea',
            message: 'I can help you book trips at Andela.',
            slackButtonHref: '/install'
        });
    }
    static install(req, res) {
        res.redirect(exports.SlackInstallUrl);
    }
    static privacy(req, res) {
        res.render('home/index.html', {});
    }
    static support(req, res) {
        res.render('home/index.html', {});
    }
    static auth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (HomeController.validateAuthRequest(req)) {
                return HomeController.renderErrorPage(res, 'Authentication failed!');
            }
            try {
                const response = yield HomeController.sendSlackAuthRequest(req);
                const jsonResponse = JSON.parse(response.body);
                if (jsonResponse.ok) {
                    const teamObject = HomeController.convertJSONResponseToTeamDetailsObj(jsonResponse);
                    yield teamDetails_service_1.teamDetailsService.saveTeamDetails(Object.assign({}, teamObject));
                    return res.render('home/installed.html');
                }
                HomeController.renderErrorPage(res, 'Tembea could not be installed in your workspace.');
            }
            catch (error) {
                bugsnagHelper_1.default.log(error);
                return HomeController.renderErrorPage(res, error.message);
            }
        });
    }
    static validateAuthRequest(req) {
        return !req.query.code || req.query.error;
    }
    static sendSlackAuthRequest(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return request_promise_native_1.default({
                url: 'https://slack.com/api/oauth.access',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                formData: {
                    client_id: process.env.SLACK_CLIENT_ID,
                    client_secret: process.env.SLACK_CLIENT_SECRET,
                    code: req.query.code
                },
                resolveWithFullResponse: true
            });
        });
    }
    static renderErrorPage(res, message) {
        const title = 'Installation failed';
        res.render('home/failed.html', { message, title });
    }
    static convertJSONResponseToTeamDetailsObj(jsonResponse) {
        const teamUrl = process.env.SLACK_TEAM_URL;
        return {
            botId: jsonResponse.bot.bot_user_id,
            botToken: jsonResponse.bot.bot_access_token,
            teamId: jsonResponse.team_id,
            teamName: jsonResponse.team_name,
            teamUrl,
        };
    }
}
exports.default = HomeController;
//# sourceMappingURL=HomeController.js.map