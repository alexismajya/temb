import * as moment from 'moment';
import { DAYS } from '../shared/models/datepicker.model';
import {IRider} from '../shared/models/rider.model';


export const createDialogOptions = (data, width = '512px', _class = 'small-modal-panel-class') => {
  return {
    width, panelClass: _class,
    data
  };
};

export const filterDateParameters = (dateFilter) => {
  const startDate = dateFilter.startDate.from ? dateFilter.startDate.from : null;
  const endDate = dateFilter.endDate.to ? dateFilter.endDate.to : null;
  return { startDate, endDate };
};

export const formatDate = (day: number, dateFormat = 'YYYY-MM-DD'): string => moment().day(day).format(dateFormat);

export const getStartAndEndDate = (currentDate = moment()): string[] => {
  let startDate: string;
  let endDate: string;
  const { LAST_WEEK_DAY } = DAYS;
  const dateValue = moment(currentDate);
  const day = currentDate.day();
  if (day > LAST_WEEK_DAY) {
    startDate = dateValue.clone()
      .startOf('isoWeek')
      .format('YYYY-MM-DD');
    endDate = dateValue.clone()
      .endOf('isoWeek')
      .subtract(2, 'days')
      .format('YYYY-MM-DD');
  } else {
    [startDate, endDate] = getDatesForPreviousWeek(dateValue);
  }
  return [startDate, endDate];
};

export const getDatesForPreviousWeek = (dateValue: moment.Moment) => {
  const previousMonday = dateValue.clone()
    .startOf('isoWeek')
    .subtract(1, 'weeks')
    .format('YYYY-MM-DD');
  const previousFriday = dateValue.clone()
    .endOf('isoWeek')
    .subtract(1, 'weeks')
    .subtract(2, 'days')
    .format('YYYY-MM-DD');
  return [previousMonday, previousFriday];
};

export const formatCurrentDate = () => {
  const today = new Date();
  const  dd = String(today.getDate()).padStart(2, '0');
  const  mm = String(today.getMonth() + 1).padStart(2, '0');
  const  yyyy = today.getFullYear();
  const formattedDate = yyyy + '-' + mm + '-' + dd;
  return  formattedDate ;
};

export const getRiderList = (data: IRider[]) => {
  return data.filter(r => r.batchRecord.batch && r.batchRecord.batch.route)
    .map(rider => {
      const {
        picture,
        user: { name },
        batchRecord: {
          batch: { route }
        }
      } = rider;
    return { picture, name, routeName: route.name };
  });
};
