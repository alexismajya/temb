import moment from 'moment';
import {
    SelectElement, InputBlock, TextInput, DatePicker,
  } from '../models/slack-block-models';

export default class SlackTravelHelpers {
  static generateFlightDetailsModal(
        isEdit: boolean, pickupSelect: SelectElement, destinationSelect: any,
        cachedFlightNumber: string, cachedDate: string, cachedTime: string, cachedReason: string,
      ) {
    const pickup = new InputBlock(pickupSelect, 'Pick-up Location', 'pickup');
    const destination = new InputBlock(destinationSelect, 'Destination', 'destination');
    const flightNumber = new InputBlock(
          new TextInput('Enter flight number', 'flightNumber', false, isEdit ? cachedFlightNumber : ''),
          'Flight Number', 'flightNumber');
    const defaultDate = moment().format('YYYY-MM-DD');
    const flightDate = new InputBlock(new DatePicker(isEdit ? cachedDate : defaultDate, 'select date', 'date'),
          'Select Flight Date', 'date');
    const time = new InputBlock(new TextInput('HH:mm', 'time', false, isEdit ? cachedTime : ''), 'Time', 'time');
    const textarea = new InputBlock(
          new TextInput('Enter reason for booking the trip', 'reason',
          true, isEdit ? cachedReason : ''), 'Reason', 'reason');
    return [pickup, destination, flightNumber, flightDate, time, textarea];
  }
}
