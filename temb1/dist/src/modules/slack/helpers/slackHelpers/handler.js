"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SlackMessageModels_1 = require("../../SlackModels/SlackMessageModels");
exports.getAction = (payload, btnAction) => {
    const { actions, callback_id: callBackId } = payload;
    let action = callBackId.split('_')[2];
    if (action === btnAction) {
        ([{ name: action }] = actions);
    }
    return action;
};
exports.handleActions = (payload, respond, inputHandlers, extraHandlers = null) => {
    const callbackName = exports.getAction(payload, 'actions');
    let routeHandler = inputHandlers[callbackName];
    if (extraHandlers && !routeHandler)
        routeHandler = extraHandlers[callbackName];
    if (routeHandler) {
        return routeHandler(payload, respond);
    }
    respond(new SlackMessageModels_1.SlackInteractiveMessage('Thank you for using Tembea. See you again.'));
};
//# sourceMappingURL=handler.js.map