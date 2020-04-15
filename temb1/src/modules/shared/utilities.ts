import moment from 'moment';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import environment from '../../config/environment';

moment.updateLocale('en', {
  weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
});

export class Utilities {
  constructor(private readonly env = environment) { }

  toSentenceCase(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return moment(date).format('ddd, MMM Do YYYY hh:mm a');
  }

  getPreviousMonth(index = 0) {
    return moment().date(index).format('MMM, YYYY');
  }

  nextAlphabet(firstChar: string) {
    const char = firstChar.toUpperCase();
    return String.fromCharCode(char.charCodeAt(0) + 1);
  }

  writableToReadableStream(writableStream: fs.WriteStream) {
    return fs.createReadStream(writableStream.path);
  }

  removeHoursFromDate(noOfHours: number, date: string | moment.Moment) {
    const rawDate = moment(date, 'DD/MM/YYYY HH:mm').subtract(
      noOfHours,
      'hours',
    );
    return rawDate.format('DD/MM/YYYY HH:mm');
  }

  getNameFromEmail(fellowEmail: string) {
    if (!fellowEmail) return;
    let name;
    const email = fellowEmail.substring(0, fellowEmail.indexOf('@'));
    if (email.indexOf('.') !== -1) {
      const [firstName, lastName] = email.split('.');
      name = `${this.toSentenceCase(firstName)} ${this.toSentenceCase(lastName)}`;
    }
    return name;
  }

  /**
   * Convert working hours string from HH:mm - HH:mm to clock time object. eg: 20:30 - 01:30
   * is converted to { from: '08:30 pm', to: '01:30 am' }
   * @param {string} workHours
   * @return { {from:string, to:string} }
   */
  formatWorkHours(workHours: string) {
    let [from, to] = workHours.split('-');
    from = this.formatTime(from);
    to = this.formatTime(to);
    return { from, to };
  }

  formatTime(time: string) {
    return moment(time.trim(), 'HH:mm')
      .format('LT');
  }

  /**
   * @static generateToken
   * @description This function generates and encrypts JWT token
   * @param  {integer} time
   * @param  {object} payload
   * @returns {string} encrypted JWT token
   */
  generateToken(time: string, payload: any) {
    const secret = this.env.TEMBEA_PRIVATE_KEY;
    const token = jwt.sign(payload, secret, { expiresIn: time, algorithm: 'RS256' });
    return token;
  }

  verifyToken(token: string, envSecret: 'TEMBEA_PUBLIC_KEY' | 'JWT_ANDELA_KEY') {
    const secret = this.env[envSecret];
    const decodedData = jwt.verify(token, secret);
    return decodedData;
  }

  mapThroughArrayOfObjectsByKey<T = { [key: string]: string }>(array: T[], prop: string): any[] {
    let result = [];
    if (array.length > 0) {
      result = array.map((item: any) => item[prop]);
    }
    return result;
  }

  getLastWeekStartDate(format: string) {
    return moment().subtract(1, 'weeks').startOf('isoWeek').format(format);
  }

  getPreviousMonthsDate(numberOfMonths: number) {
    return moment(new Date()).subtract({ months: numberOfMonths }).format('YYYY-MM-DD');
  }
}
