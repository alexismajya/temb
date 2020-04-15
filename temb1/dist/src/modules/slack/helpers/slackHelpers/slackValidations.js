"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isTripRequestApproved = (request) => {
    const { approvedById } = request;
    return !!approvedById;
};
exports.isTripRequestApproved = isTripRequestApproved;
const isTripRescheduleTimedOut = (tripRequest) => {
    const { departureTime } = tripRequest;
    let timeOut = (Date.parse(departureTime) - Date.now()) / 60000;
    timeOut /= 60;
    return timeOut < 1;
};
exports.isTripRescheduleTimedOut = isTripRescheduleTimedOut;
const isSlackSubCommand = (commandToCheck, subCommand) => commandToCheck.includes(subCommand);
exports.isSlackSubCommand = isSlackSubCommand;
//# sourceMappingURL=slackValidations.js.map