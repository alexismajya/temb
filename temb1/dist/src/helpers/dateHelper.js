"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_timezone_1 = __importDefault(require("moment-timezone"));
class TimeElementGenerator {
    static getYearElement() {
        const thisYear = new Date().getFullYear();
        return {
            label: 'Year',
            type: 'select',
            name: 'newYear',
            placeholder: 'Year',
            options: [
                {
                    label: thisYear,
                    value: thisYear
                },
                {
                    label: thisYear + 1,
                    value: thisYear + 1
                }
            ]
        };
    }
    static getMonthElement() {
        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];
        return {
            label: 'Month',
            type: 'select',
            name: 'newMonth',
            placeholder: 'Month',
            options: months.map((month, index) => ({
                label: month,
                value: index
            }))
        };
    }
    static getDateElement() {
        const options = [];
        for (let i = 1; i <= 31; i += 1) {
            options.push({
                label: i,
                value: i
            });
        }
        return {
            label: 'Date',
            type: 'select',
            name: 'newDate',
            placeholder: 'Date',
            options
        };
    }
    static getTime() {
        return {
            label: 'Time',
            type: 'text',
            hint: 'hh:mm',
            placeholder: 'Time in 24 Hour format',
            name: 'time'
        };
    }
}
class DateDialogHelper {
    static generateDialogElements() {
        return [
            TimeElementGenerator.getYearElement(),
            TimeElementGenerator.getMonthElement(),
            TimeElementGenerator.getDateElement(),
            TimeElementGenerator.getTime()
        ];
    }
    static dateChecker(userDateInput, timezoneOffset) {
        const newDate = this.changeDateTimeFormat(userDateInput);
        const dateInputTime = new Date(newDate).getTime();
        const now = new Date().getTime();
        const contextTimezoneOffset = new Date().getTimezoneOffset() * 60000;
        return dateInputTime - (now + contextTimezoneOffset + (timezoneOffset * 1000));
    }
    static validateDate(date) {
        const month = '([1-9]|0[1-9]|1[0-2])';
        const day = '(0?[1-9]|[1-2][0-9]|3[0-1])';
        const year = '([2][0][0-9]{2})';
        const dateFormat = new RegExp(`^${month}[/]${day}[/]${year}$`);
        const dateFormat2 = new RegExp(`^${day}[/]${month}[/]${year}$`);
        let test = dateFormat.test(date);
        if (!test)
            test = dateFormat2.test(date);
        return test;
    }
    static validateTime(time) {
        const timeDate = new RegExp('^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$');
        return timeDate.test(time);
    }
    static validateDateTime(dateTime) {
        const [date, time] = dateTime.split(' ');
        return DateDialogHelper.validateTime(time || '') && DateDialogHelper.validateDate(date);
    }
    static changeDateFormat(date) {
        const [day, month, year] = date.replace(',', '').split('/');
        return `${month}/${day}/${year}`;
    }
    static changeDateTimeFormat(dateTime) {
        const [date, time] = dateTime.trim().split(' ');
        return `${DateDialogHelper.changeDateFormat(date)} ${time || ''}`;
    }
    static transformDate(input, tz) {
        try {
            const dateValue = DateDialogHelper.extractDate(input, tz);
            return moment_timezone_1.default.parseZone(moment_timezone_1.default.utc(dateValue))
                .toDate().toISOString();
        }
        catch (err) {
            return null;
        }
    }
    static transformToUtcIsoDate(input) {
        try {
            return moment_timezone_1.default.utc(input).toISOString();
        }
        catch (_a) {
            return null;
        }
    }
    static extractDate(input, tz) {
        const [date, time] = input.trim().split(' ');
        const [hour, minute] = time.split(':');
        const dateValue = tz ? moment_timezone_1.default.tz(date, 'DD/MM/YYYY', tz) : moment_timezone_1.default.utc(date, 'DD/MM/YYYY');
        return dateValue.add(hour, 'hours').add(minute, 'minutes');
    }
    static convertIsoString(engagementDate) {
        let { startDate, endDate } = engagementDate;
        const sanitizedSD = DateDialogHelper.changeDateTimeFormat(startDate);
        const sanitizedED = DateDialogHelper.changeDateTimeFormat(endDate);
        startDate = moment_timezone_1.default(sanitizedSD, 'MM-DD-YYYY')
            .toISOString();
        endDate = moment_timezone_1.default(sanitizedED, 'MM-DD-YYYY')
            .toISOString();
        return {
            startDate,
            endDate
        };
    }
    static mergeDateAndTime(data, tz) {
        const dateTime = moment_timezone_1.default(`${data.date} ${data.time}`, 'YYYY-MM-DD HH:mm', true)
            .tz(tz).toISOString();
        return dateTime;
    }
}
exports.default = DateDialogHelper;
//# sourceMappingURL=dateHelper.js.map