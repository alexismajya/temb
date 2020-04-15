"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_timezone_1 = __importDefault(require("moment-timezone"));
exports.getSlackDateTime = (dateTime) => {
    const newDateTime = new Date(dateTime);
    const [fallback, original] = [
        moment_timezone_1.default(newDateTime).format('ddd, MMM Do YYYY hh:mm a'),
        moment_timezone_1.default(newDateTime).unix()
    ];
    return {
        fallback,
        original
    };
};
exports.getSlackDateString = (dateTime) => {
    const newDateTime = new Date(dateTime);
    const [fallback, original] = [
        moment_timezone_1.default(newDateTime).format('ddd, MMM Do YYYY hh:mm a'),
        moment_timezone_1.default(newDateTime).unix()
    ];
    const date = new Date(0);
    date.setUTCSeconds(original);
    const year = date.getFullYear();
    return `<!date^${original}^{date_long} ${year} at {time}|${fallback}>`;
};
exports.getSlackDateTimeString = (dateTime) => {
    const newDateTime = new Date(dateTime);
    const date = moment_timezone_1.default(newDateTime).format('dddd, MMMM Do YYYY');
    const time = moment_timezone_1.default(newDateTime).format('h:mm a');
    const getDateTime = `${date} at ${time}`;
    return getDateTime;
};
exports.getSlackTimeOnly = (dateTime) => {
    const newDateTime = new Date(dateTime);
    const [fallback, original] = [
        moment_timezone_1.default(newDateTime).format('hh:mm a'),
        moment_timezone_1.default(newDateTime).unix()
    ];
    return `<!date^${original}^{time}|${fallback} GMT+00>`;
};
exports.timeTo12hrs = (hrs24) => moment_timezone_1.default(hrs24, 'HH:mm', true)
    .format('hh:mm a')
    .toUpperCase();
const timeZones = Object.freeze({
    lagos: 'Africa/Lagos',
    cairo: 'Africa/Cairo',
    kampala: 'Africa/Kampala',
    kigali: 'Africa/Kigali',
    nairobi: 'Africa/Nairobi'
});
exports.getTimezone = (homebase) => timeZones[homebase.toLowerCase()];
exports.checkBeforeSlackDateString = (datetime) => {
    if (/^\d+-\d+-\d+T\d+:\d+:\d+.\d+Z$/.test(datetime)) {
        return exports.getSlackDateString(datetime);
    }
    return datetime;
};
//# sourceMappingURL=dateHelpers.js.map