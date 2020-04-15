import * as moment from 'moment';
import { DAYS } from '../shared/models/datepicker.model';
export var createDialogOptions = function (data, width, _class) {
    if (width === void 0) { width = '512px'; }
    if (_class === void 0) { _class = 'small-modal-panel-class'; }
    return {
        width: width, panelClass: _class,
        data: data
    };
};
export var filterDateParameters = function (dateFilter) {
    var startDate = dateFilter.startDate.from ? dateFilter.startDate.from : null;
    var endDate = dateFilter.endDate.to ? dateFilter.endDate.to : null;
    return { startDate: startDate, endDate: endDate };
};
export var formatDate = function (day, dateFormat) {
    if (dateFormat === void 0) { dateFormat = 'YYYY-MM-DD'; }
    return moment().day(day).format(dateFormat);
};
export var getStartAndEndDate = function (currentDate) {
    if (currentDate === void 0) { currentDate = moment(); }
    var _a;
    var startDate;
    var endDate;
    var LAST_WEEK_DAY = DAYS.LAST_WEEK_DAY;
    var dateValue = moment(currentDate);
    var day = currentDate.day();
    if (day > LAST_WEEK_DAY) {
        startDate = dateValue.clone()
            .startOf('isoWeek')
            .format('YYYY-MM-DD');
        endDate = dateValue.clone()
            .endOf('isoWeek')
            .subtract(2, 'days')
            .format('YYYY-MM-DD');
    }
    else {
        _a = getDatesForPreviousWeek(dateValue), startDate = _a[0], endDate = _a[1];
    }
    return [startDate, endDate];
};
export var getDatesForPreviousWeek = function (dateValue) {
    var previousMonday = dateValue.clone()
        .startOf('isoWeek')
        .subtract(1, 'weeks')
        .format('YYYY-MM-DD');
    var previousFriday = dateValue.clone()
        .endOf('isoWeek')
        .subtract(1, 'weeks')
        .subtract(2, 'days')
        .format('YYYY-MM-DD');
    return [previousMonday, previousFriday];
};
export var formatCurrentDate = function () {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    var formattedDate = yyyy + '-' + mm + '-' + dd;
    return formattedDate;
};
export var getRiderList = function (data) {
    return data.filter(function (r) { return r.batchRecord.batch && r.batchRecord.batch.route; })
        .map(function (rider) {
        var picture = rider.picture, name = rider.user.name, route = rider.batchRecord.batch.route;
        return { picture: picture, name: name, routeName: route.name };
    });
};
//# sourceMappingURL=helpers.js.map