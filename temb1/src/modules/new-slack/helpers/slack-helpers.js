import moment from 'moment';
import {
  ButtonElement, CancelButtonElement, SlackText, Block, BlockTypes,
  ActionBlock, InputBlock, DatePicker, TextInput, Modal, SelectElement, ElementTypes
} from '../models/slack-block-models';
import Validators from '../../../helpers/slack/UserInputValidator/Validators';
import {
  SlackDialogError, SlackDialogSelectElementWithOptions, SlackDialogText
} from '../../slack/SlackModels/SlackDialogModels';
import { toLabelValuePairs } from '../../../helpers/slack/createTripDetailsForm';
import SlackHelpers from '../../../helpers/slack/slackHelpers';
import WebClientSingleton from '../../../utils/WebClientSingleton';
import Cache from '../../shared/cache';
import userTripActions from '../trips/user/actions';
import { addressService } from '../../addresses/address.service';
import { TripStatus } from '../../../database/models/trip-request';
import tripService from '../../trips/trip.service';
import { homebaseService } from '../../homebases/homebase.service';
import { SlackActionButtonStyles } from '../../slack/SlackModels/SlackMessageModels';

export const sectionDivider = new Block(BlockTypes.divider);
export const defaultKeyValuePairs = { text: 'text', value: 'value' };

export default class NewSlackHelpers {
  static getCancelButton(actionId) {
    return new CancelButtonElement('Cancel', 'cancel', actionId, {
      title: 'Are you sure?',
      description: 'Do you really want to cancel',
      confirmText: 'Yes',
      denyText: 'No'
    });
  }

  static getNavButtons(backValue, backActionId) {
    const navigationButtons = [
      new ButtonElement(new SlackText('< Back'), backValue, backActionId),
      NewSlackHelpers.getCancelButton(userTripActions.cancel),
    ];
    return navigationButtons;
  }

  static getNavBlock(blockId, backActionId, backValue) {
    const navButtons = NewSlackHelpers.getNavButtons(backValue, backActionId);
    const navigation = new ActionBlock(blockId);
    navigation.addElements(navButtons);
    return navigation;
  }

  static searchButton(actionId, blockId) {
    const searchBtn = [new ButtonElement(new SlackText('Search'), 'search',
      actionId, SlackActionButtonStyles.primary)];
    const action = new ActionBlock(blockId);
    action.addElements(searchBtn);
    return action;
  }

  static dialogValidator(data, schema) {
    try {
      const results = Validators.validateSubmission(data, schema);
      return results;
    } catch (err) {
      const error = new Error('dialog validation failed');
      error.errors = err.errors.details.map((e) => {
        const key = e.path[0];
        return new SlackDialogError(key,
          e.message || 'the submitted property for this value is invalid');
      });
      throw error;
    }
  }

  static modalValidator(data, schema) {
    try {
      const results = Validators.validateSubmission(data, schema);
      return results;
    } catch (err) {
      const error = new Error('dialog validation failed');
      error.errors = {};
      err.errors.details.forEach((e) => {
        const key = e.path[0];
        error.errors[key] = e.message || 'the submitted property for this value is invalid';
      });
      throw error;
    }
  }

  static hasNeededProps(data, keyPairs) {
    let hasProps = false;
    if (data) {
      const func = Object.prototype.hasOwnProperty;
      hasProps = func.call(data, keyPairs.text) && func.call(data, keyPairs.value);
    }
    return hasProps;
  }

  static toSlackDropdown(data, keyPairs = defaultKeyValuePairs) {
    return data.filter((e) => this.hasNeededProps(e, keyPairs))
      .map((entry) => ({
        text: new SlackText(entry[keyPairs.text].toString()),
        value: entry[keyPairs.value].toString()
      }));
  }

  static async getAddresses(homeBaseName) {
    const addresses = await addressService.getAddressListByHomebase(homeBaseName);
    addresses.push('Others');
    return addresses;
  }

  static async getDestinationFields(homeBaseName, destination, othersDestination, isEdit) {
    const addresses = await NewSlackHelpers.getAddresses(homeBaseName);
    const locations = toLabelValuePairs(addresses);
    const destinationField = new SlackDialogSelectElementWithOptions('Destination location',
      'destination', locations, isEdit ? destination : null);
    const othersDestinationField = new SlackDialogText('Others?',
      'othersDestination', 'Enter destination', true, null, isEdit ? othersDestination : null);
    return [
      destinationField,
      othersDestinationField
    ];
  }

  static async getUserInfo(slackId, slackBotOauthToken) {
    const cacheKey = `USER_SLACK_INFO_${slackId}`;
    const result = await Cache.fetch(cacheKey);
    if (result) return result;
    const { user } = await WebClientSingleton.getWebClient(slackBotOauthToken).users.info({
      user: slackId
    });
    await Cache.saveObject(cacheKey, user);
    return user;
  }

  static modalParser(data) {
    const parsed = {};
    Object.keys(data).forEach((blockId) => {
      const actionBlock = data[blockId];
      switch (actionBlock[blockId].type) {
        case 'datepicker':
          parsed[blockId] = actionBlock[blockId].selected_date;
          break;
        case 'plain_text_input':
          parsed[blockId] = actionBlock[blockId].value;
          break;
        case 'users_select':
          parsed[blockId] = actionBlock[blockId].selected_user;
          break;
        case 'external_select':
        case 'static_select':
          parsed[blockId] = actionBlock[blockId].selected_option.value;
        default:
          break;
      }
    });

    return parsed;
  }

  static async getTripState(tripId) {
    const trip = await tripService.getById(tripId, true);

    const state = {
      currentState: trip.tripStatus,
      lastActionById: trip.requester.slackId,
    };

    switch (trip.tripStatus) {
      case TripStatus.confirmed:
        state.lastActionById = trip.confirmer.slackId;
        break;
      case TripStatus.approved:
        state.lastActionById = trip.approver.slackId;
        break;
      case TripStatus.declinedByManager:
      case TripStatus.declinedByOps:
        state.lastActionById = trip.decliner.slackId;
        break;
      default:
        break;
    }

    return state;
  }

  static async getPickupModal(homebaseName, state) {
    const defaultDate = moment().format('YYYY-MM-DD');
    const date = new InputBlock(new DatePicker(defaultDate, 'select a date', 'date'),
      'Select Date', 'date');
    const time = new InputBlock(new TextInput('HH:mm', 'time'), 'Time', 'time');
    const addresses = await NewSlackHelpers.getAddresses(homebaseName);
    const addressOptions = NewSlackHelpers.toSlackSelectOptions(addresses);
    const pickupLocations = new InputBlock(
      new SelectElement(ElementTypes.staticSelect, 'Select Pickup Location', 'pickup')
        .addOptions(addressOptions), 'PickUp Location', 'pickup'
    );
    const othersPickup = new InputBlock(new TextInput('Enter pickup location', 'othersPickup'),
      'Others?', 'othersPickup', true, 'e.g Westlands, Nairobi');

    const modal = Modal.createModal({
      modalTitle: 'Pickup Details',
      modalOptions: {
        submit: 'Submit',
        close: 'Cancel',
      },
      inputBlocks: [date, time, pickupLocations, othersPickup],
      callbackId: userTripActions.pickupModalSubmit,
      metadata: JSON.stringify(state),
    });
    return modal;
  }

  static toSlackSelectOptions(data, { textProp, valueProp } = {}, isArrayOfString = false) {
    if (isArrayOfString) return data.map((entry) => ({ text: new SlackText(entry), value: entry }));
    return data.map((entry) => {
      let option = null;
      if (typeof entry === 'string') {
        option = {
          text: new SlackText(entry),
          value: entry,
        };
      } else {
        option = {
          text: new SlackText(entry[textProp]),
          value: `${entry[valueProp]}`,
        };
      }
      return option;
    });
  }

  static async getHomeBaseMessage(slackId) {
    const homeBase = await homebaseService.getHomeBaseBySlackId(slackId, true);
    const homeBaseMessage = homeBase
      ? `_Your current home base is ${SlackHelpers.getLocationCountryFlag(homeBase.country.name)} *${homeBase.name}*_`
      : '`Please set your location to continue`';
    return homeBaseMessage;
  }
  
  static wrapSlackHandle(slackId) {
    return `<@${slackId}>`;
  }
}
