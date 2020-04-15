"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const slackEvents_1 = require("../slackEvents");
slackEvents_1.SlackEvents.handle(slackEvents_1.slackEventNames.DECLINED_TRIP_REQUEST, (ride, respond) => {
    respond({
        data: 'Notification sent'
    });
});
exports.default = slackEvents_1.SlackEvents;
//# sourceMappingURL=index.js.map