"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@slack/client");
class WebClientSingleton {
    static getWebClient(teamBotOauthToken) {
        return new client_1.WebClient(teamBotOauthToken);
    }
}
exports.default = WebClientSingleton;
//# sourceMappingURL=WebClientSingleton.js.map