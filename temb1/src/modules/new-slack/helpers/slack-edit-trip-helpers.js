import NewSlackHelpers from './slack-helpers';
import {
  InputBlock, DatePicker, TextInput, Modal, SelectElement, ElementTypes
} from '../models/slack-block-models';
import SlackHelpers from '../../../helpers/slack/slackHelpers';
import userTripActions from '../trips/user/actions';

export default class EditTripHelpers {
  static async getEditRequestModal(tripDetails, responseUrl, allDepartments, homebaseName) {
    const {
      reason, passengers, dateTime, department, pickup, othersPickup, rider, id
    } = tripDetails;
    const [riderInfo, userReason] = EditTripHelpers.getRiderAndReason(rider || id, reason);
    const [morePassengers, date, time] = EditTripHelpers.getPassengersAndTime(passengers, dateTime);
    const departments = EditTripHelpers.getDepartmentsEdit(allDepartments, department);
    const addresses = await NewSlackHelpers.getAddresses(homebaseName);
    const [
      pickupInfo, othersOptionPickup,
    ] = EditTripHelpers.getPickupEdit(addresses, pickup, othersPickup);
    const modal = EditTripHelpers.createEditTripRequestModal(
      riderInfo, userReason, morePassengers, departments, date, time, pickupInfo,
      othersOptionPickup, responseUrl
    );
    return modal;
  }
      
  static generateSelectedOption(option) {
    const defaultOption = typeof (option) !== 'undefined' ? option : 'Others';
    const selOption = [];
    selOption.push(defaultOption.toString());
    const selectedOption = NewSlackHelpers.toSlackSelectOptions(selOption);
    return selectedOption[0];
  }
    
  static getPickupEdit(
    addresses, pickup, othersPickup,
  ) {
    const addressOptions = NewSlackHelpers.toSlackSelectOptions(addresses);
    const selPickup = addresses.find((address) => address === pickup);
    const selectedPickup = EditTripHelpers.generateSelectedOption(selPickup);
    const pickupInfo = new InputBlock(
      new SelectElement(
        ElementTypes.staticSelect, 'Select Pickup Location', 'pickup', selectedPickup
      ).addOptions(addressOptions), 'PickUp Location', 'pickup'
    );
    const othersOptionPickup = new InputBlock(
      new TextInput('Enter pickup location', 'othersPickup', false, othersPickup || ''),
      'Others?', 'othersPickup', true, 'e.g Westlands, Nairobi'
    );
    return [pickupInfo, othersOptionPickup];
  }
    
  static getDepartmentsEdit(allDepartments, department) {
    const depToUse = allDepartments.map(({ text }) => text);
    const departs = NewSlackHelpers.toSlackSelectOptions(depToUse);
    const selDepartment = depToUse.filter(
      (text) => text === department
    );
    const selectedDepartment = NewSlackHelpers.toSlackSelectOptions(selDepartment);
    const departments = new InputBlock(new SelectElement(
      ElementTypes.staticSelect, 'Select Department', 'department', selectedDepartment[0]
    ).addOptions(departs), 'Select Department', 'department');
    return departments;
  }
    
  static getPassengers(passengers) {
    const noOfPassengers = NewSlackHelpers.toSlackDropdown(SlackHelpers.noOfPassengers(0));
    const selectedPassenger = EditTripHelpers.generateSelectedOption(passengers - 1);
    const morePassengers = new InputBlock(new SelectElement(
      ElementTypes.staticSelect, 'Any more passengers',
      'passengers', selectedPassenger
    ).addOptions(noOfPassengers), 'Any more passengers', 'passengers');
    return morePassengers;
  }
    
  static getRiderAndReason(userId, reason) {
    const rider = new InputBlock(
      new SelectElement(ElementTypes.userSelect, 'Select a rider', 'rider', undefined, userId),
      'Rider?', 'rider'
    );
    const userReason = new InputBlock(
      new TextInput('reason', 'reason', true, reason), 'Reason', 'reason'
    );
    return [rider, userReason];
  }
      
  static getPassengersAndTime(passengers, dateTime) {
    const morePassengers = EditTripHelpers.getPassengers(passengers);
    const [requestDate, requestTime] = dateTime.split(' ');
    const date = new InputBlock(new DatePicker(requestDate, 'select a date', 'date'),
      'Pickup Details || Select Date', 'date');
    const time = new InputBlock(
      new TextInput('HH:mm', 'time', false, requestTime), 'Pickup Details || Time', 'time'
    );
    return [morePassengers, date, time];
  }
    
  static async createEditTripRequestModal(
    rider, userReason, morePassengers, departments, date, time, pickupInfo,
    othersOptionPickup, responseUrl
  ) {
    const modal = Modal.createModal({
      modalTitle: 'Edit Trip Request',
      modalOptions: {
        submit: 'Submit',
        close: 'Cancel',
      },
      inputBlocks: [
        rider, userReason, morePassengers, departments, date, time, pickupInfo,
        othersOptionPickup
      ],
      callbackId: userTripActions.editRequestModalSubmit,
      metadata: JSON.stringify({ origin: responseUrl }),
    });
    return modal;
  }
}
