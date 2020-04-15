"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const fs_1 = __importDefault(require("fs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const environment_1 = __importDefault(require("../../config/environment"));
moment_1.default.updateLocale('en', {
    weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
});
class Utilities {
    constructor(env = environment_1.default) {
        this.env = env;
    }
    toSentenceCase(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }
    formatDate(dateStr) {
        const date = new Date(dateStr);
        return moment_1.default(date).format('ddd, MMM Do YYYY hh:mm a');
    }
    getPreviousMonth(index = 0) {
        return moment_1.default().date(index).format('MMM, YYYY');
    }
    nextAlphabet(firstChar) {
        const char = firstChar.toUpperCase();
        return String.fromCharCode(char.charCodeAt(0) + 1);
    }
    writableToReadableStream(writableStream) {
        return fs_1.default.createReadStream(writableStream.path);
    }
    removeHoursFromDate(noOfHours, date) {
        const rawDate = moment_1.default(date, 'DD/MM/YYYY HH:mm').subtract(noOfHours, 'hours');
        return rawDate.format('DD/MM/YYYY HH:mm');
    }
    getNameFromEmail(fellowEmail) {
        if (!fellowEmail)
            return;
        let name;
        const email = fellowEmail.substring(0, fellowEmail.indexOf('@'));
        if (email.indexOf('.') !== -1) {
            const [firstName, lastName] = email.split('.');
            name = `${this.toSentenceCase(firstName)} ${this.toSentenceCase(lastName)}`;
        }
        return name;
    }
    formatWorkHours(workHours) {
        let [from, to] = workHours.split('-');
        from = this.formatTime(from);
        to = this.formatTime(to);
        return { from, to };
    }
    formatTime(time) {
        return moment_1.default(time.trim(), 'HH:mm')
            .format('LT');
    }
    generateToken(time, payload) {
        const secret = this.env.TEMBEA_PRIVATE_KEY;
        const token = jsonwebtoken_1.default.sign(payload, secret, { expiresIn: time, algorithm: 'RS256' });
        return token;
    }
    verifyToken(token, envSecret) {
        const secret = this.env[envSecret];
        const decodedData = jsonwebtoken_1.default.verify(token, secret);
        return decodedData;
    }
    mapThroughArrayOfObjectsByKey(array, prop) {
        let result = [];
        if (array.length > 0) {
            result = array.map((item) => item[prop]);
        }
        return result;
    }
    getLastWeekStartDate(format) {
        return moment_1.default().subtract(1, 'weeks').startOf('isoWeek').format(format);
    }
    getPreviousMonthsDate(numberOfMonths) {
        return moment_1.default(new Date()).subtract({ months: numberOfMonths }).format('YYYY-MM-DD');
    }
}
exports.Utilities = Utilities;
//# sourceMappingURL=utilities.js.map