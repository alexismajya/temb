import { IDateData, ITimeData } from '../interfaces/schedul-request.interface';

class SchedulerHelper {

  /**
   * @description Get hours and minute from a time string
   * @param {string} timeString The time string in format HH:mm
   * @returns {object}  The object with keys hour and minute
   */
  static getTimeValues(timeString: string): ITimeData {
    const splitedTime = timeString.split(':');
    let hour: string = '*';
    let minute: string = '*';
    hour = splitedTime[0];
    minute = splitedTime[1];
    return { hour, minute};
  }

  /**
   * @description Get day and month from date string
   * @param {string} dateString The datestring in format DD-MM or DD
   * @returns {object} The object with keys day and month
   */
  static getDateValues(dateString: string): IDateData {
    const splitedDate: string[] = dateString.split('-');
    let day: string = '*';
    let month: string = '*';
    if (splitedDate[1]) {
      month = splitedDate[1];
    }
    day = splitedDate[0];
    return { day, month};
  }

  /**
   * @description Generate a cron pattern from a date-time string
   * @param {string} dateTime The date and time string
   * @returns {string} A string with a cron pattern
   */
  static generateCron(dateTime: string): string {
    const splitedDateTime: string[] = dateTime.split(' ');
    let dateObject: IDateData;
    let timeObject: ITimeData;
    if (splitedDateTime[1]) {
      dateObject = SchedulerHelper.getDateValues(splitedDateTime[0]);
      timeObject = SchedulerHelper.getTimeValues(splitedDateTime[1]);
    } else {
      timeObject = SchedulerHelper.getTimeValues(splitedDateTime[0]);
    }
    const { day, month } = dateObject;
    const { hour, minute } = timeObject;
    const cron: string = `${minute} ${hour} ${day} ${month} *`;
    return cron;
  }

  /**
   * @description Get the repeat time in milliseconds for a sequential job
   * @param {string} dateTimeString The string with repeat time
   * @returns { number} The repeat time in milliseconds
   */
  static getRepeatTime(dateTimeString: string): number {
    const splitedDateTime: string[] = dateTimeString.split(' ');
    const dateString: string = splitedDateTime[0];
    const timeArray = splitedDateTime[1].split(':');
    const day: number = parseInt(dateString[0], 10);
    const hour: number = parseInt(timeArray[0], 10);
    const minute: number = parseInt(timeArray[1], 10);
    const repeatTime: number = day * 86400000 + hour * 3600000 + minute * 60000;
    return repeatTime;
  }

}

export default SchedulerHelper;
