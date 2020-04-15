"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_promise_native_1 = __importDefault(require("request-promise-native"));
class SlackViews {
    constructor(botToken, baseUrl = 'https://slack.com/api') {
        this.endpoints = {
            open: `${baseUrl}/views.open`,
            push: `${baseUrl}/views.push`,
            update: `${baseUrl}/views.update`,
        };
        this.send = ({ url, body }) => request_promise_native_1.default.post({
            url,
            body,
            headers: {
                Authorization: `Bearer ${botToken}`,
            },
            json: true,
        });
    }
    open(triggerId, payload) {
        const body = {
            trigger_id: triggerId,
            view: payload,
        };
        const submit = this.send({
            body,
            url: this.endpoints.open,
        });
        return submit;
    }
    update(viewId, payload) {
        const body = {
            view_id: viewId,
            view: payload,
        };
        const submit = this.send({
            body,
            url: this.endpoints.update,
        });
        return submit;
    }
}
exports.SlackViews = SlackViews;
SlackViews.getSlackViews = (botToken) => new SlackViews(botToken);
SlackViews.open = (options) => SlackViews.getSlackViews(options.botToken)
    .open(options.triggerId, options.modal);
const getSlackViews = (botToken) => new SlackViews(botToken);
exports.default = getSlackViews;
//# sourceMappingURL=SlackViews.js.map