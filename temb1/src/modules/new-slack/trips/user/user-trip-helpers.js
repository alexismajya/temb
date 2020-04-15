import Cache from '../../../shared/cache';
import SlackHelpers from '../../../../helpers/slack/slackHelpers';
import {
  SlackText, MarkdownText, Block, BlockTypes, SelectElement, ElementTypes, ButtonElement,
  BlockMessage, CancelButtonElement, ActionBlock, SectionBlock,
} from '../../models/slack-block-models';
import NewSlackHelpers, { sectionDivider } from '../../helpers/slack-helpers';
import { getTripKey } from '../../../../helpers/slack/ScheduleTripInputHandlers';
import { departmentService } from '../../../departments/department.service';
import { SlackActionButtonStyles } from '../../../slack/SlackModels/SlackMessageModels';
import NewLocationHelpers, { getPredictionsKey } from '../../helpers/location-helpers';
import {
  tripReasonSchema, createUserDestinationSchema, tripPaymentSchema
} from '../schemas';
import userTripActions from './actions';
import userTripBlocks from './blocks';
import PreviewTripBooking from './preview-trip-booking-helper';
import tripService from '../../../trips/trip.service';
import { homebaseService } from '../../../homebases/homebase.service';

export default class UserTripHelpers {
  static createStartMessage() {
    const headerText = new MarkdownText('*Who are you booking for?*');
    const header = new Block().addText(headerText);
    const mainButtons = [
      new ButtonElement(new SlackText('For Me'), 'forMe',
        userTripActions.forMe, SlackActionButtonStyles.primary),
      new ButtonElement(new SlackText('For Someone'), 'forSomeone',
        userTripActions.forSomeone, SlackActionButtonStyles.primary)
    ];
    const newTripBlock = new ActionBlock(userTripBlocks.start);
    newTripBlock.addElements(mainButtons);
    const navigation = UserTripHelpers.getTripNavBlock('back_to_launch');
    const blocks = [header, newTripBlock, new Block(BlockTypes.divider), navigation];
    const message = new BlockMessage(blocks);
    return message;
  }

  static getAddPassengersMessage(forSelf = 'true') {
    const noOfPassengers = NewSlackHelpers.toSlackDropdown(SlackHelpers.noOfPassengers());
    const textBlock = new Block().addText(new MarkdownText('*Any more passengers?*'));
    const passengersActions = new ActionBlock(userTripBlocks.addPassengers);
    const selectPassengers = new SelectElement(
      ElementTypes.staticSelect, 'No. of passengers',
      userTripActions.addExtraPassengers
    );
    selectPassengers.addOptions(noOfPassengers);

    const noButton = new ButtonElement(new SlackText('No'), '0', userTripActions.noPassengers,
      'primary');
    passengersActions.addElements([selectPassengers, noButton]);

    const backActionId = forSelf === 'true' ? userTripActions.forMe : userTripActions.forSomeone;
    const navigation = this.getTripNavBlock(backActionId);
    const blocks = [textBlock, passengersActions, sectionDivider, navigation];
    const message = new BlockMessage(blocks);
    return message;
  }

  static getTripNavBlock(value) {
    return NewSlackHelpers.getNavBlock(userTripBlocks.navBlock,
      userTripActions.back, value);
  }

  static getRiderSelectMessage() {
    const options = new SelectElement(ElementTypes.userSelect, 'Select a passenger',
      userTripActions.setPassenger);
    const header = new Block(BlockTypes.section)
      .addText(new MarkdownText('*Who are you booking the ride for?*'));

    const actions = new ActionBlock(userTripBlocks.setRider).addElements([options]);
    const navigation = this.getTripNavBlock(userTripActions.forMe);
    const message = new BlockMessage([header, actions, sectionDivider, navigation]);
    return message;
  }

  static async getDepartmentListMessage(payload) {
    const { forMe } = await Cache.fetch(getTripKey(payload.user.id));
    const personify = forMe ? 'your' : "passenger's";
    const header = new Block(BlockTypes.section)
      .addText(new MarkdownText(`*Please select ${personify} department.*`));
    const slackHomebase = await homebaseService.getHomeBaseBySlackId(payload.user.id);
    const departmentsList = await departmentService.getDepartmentsForSlack(
      payload.team.id, slackHomebase.id
    );
    const departmentBlock = new ActionBlock(userTripBlocks.selectDepartment);
    const departmentButtons = departmentsList.map(
      (department) => new ButtonElement(new SlackText(department.label),
        department.value.toString(),
        `${userTripActions.getDepartment}_${department.value}`,
        SlackActionButtonStyles.primary)
    );
    departmentBlock.addElements(departmentButtons);
    const navigation = this.getTripNavBlock(userTripActions.addExtraPassengers);
    const message = new BlockMessage([header, departmentBlock, sectionDivider, navigation]);
    return message;
  }

  static async getPostForMeMessage(userId) {
    const userValue = await Cache.fetch(getTripKey(userId));
    let message;
    if (userValue.forMe) {
      message = this.getAddPassengersMessage();
    } else {
      message = this.getRiderSelectMessage();
    }
    return message;
  }

  static async createContToDestMsg(payload, isEdit) {
    const header = new Block(BlockTypes.section)
      .addText(new MarkdownText('*Please click to continue*'));

    const continueBlock = new ActionBlock(userTripBlocks.getDestFields);
    continueBlock.addElements([
      new ButtonElement(new SlackText('Enter Destination'),
        'select_destination',
        !isEdit ? userTripActions.sendDest : userTripActions.sendDestEdit,
        SlackActionButtonStyles.primary)
    ]);

    const navigation = this.getTripNavBlock(userTripActions.getDepartment);
    const message = new BlockMessage([header, continueBlock, sectionDivider, navigation]);
    return message;
  }

  static async createTripSummaryMsg(tripDetails) {
    const fields = await PreviewTripBooking.getPreviewFields(tripDetails);
    const header = new SectionBlock()
      .addText(new SlackText('Trip request preview'))
      .addFields(fields);
    const previewActionsBlock = new ActionBlock(userTripBlocks.confirmTrip);
    previewActionsBlock.addElements([
      new ButtonElement(new SlackText('Confirm'), 'confirm',
        userTripActions.confirmTripRequest,
        SlackActionButtonStyles.primary),
      new ButtonElement(new SlackText('Edit'), 'edit',
        userTripActions.editTripRequest,
        SlackActionButtonStyles.primary),
      new CancelButtonElement('Cancel', 'cancel', userTripActions.cancelTripRequest, {
        title: 'Are you sure?',
        description: 'Do you really want to cancel this trip request',
        confirmText: 'Yes',
        denyText: 'No'
      })
    ]);

    const message = new BlockMessage([header, previewActionsBlock]);
    return message;
  }

  static async getLocationVerificationMsg(location, userId, selectActionId, backActionValue) {
    const locationOptions = {
      selectBlockId: userTripBlocks.confirmLocation,
      selectActionId,
      navBlockId: userTripBlocks.navBlock,
      navActionId: userTripActions.back,
      backActionValue,
    };
    return NewLocationHelpers.getLocationVerificationMsg(location, userId, locationOptions);
  }

  static async getPostPickupMessage(payload, submission, isEdit) {
    const message = submission.pickup !== 'Others'
      ? this.createContToDestMsg(payload, isEdit)
      : await this.getLocationVerificationMsg(submission.othersPickup,
        payload.user.id,
        userTripActions.selectPickupLocation,
        userTripActions.getDepartment);
    return !message ? this.createContToDestMsg(payload, isEdit) : message;
  }

  static async getPostDestinationMessage(payload, submission) {
    const tripDetails = await Cache.fetch(getTripKey(payload.user.id));
    const destination = payload.submission !== undefined
      ? payload.submission.destination
      : submission.destination;
    const othersDestination = payload.submission !== undefined
      ? payload.submission.othersDestination
      : submission.othersDestination;
    const message = destination !== 'Others'
      ? await this.createTripSummaryMsg(tripDetails)
      : await this.getLocationVerificationMsg(othersDestination,
        payload.user.id,
        userTripActions.selectDestinationLocation,
        userTripActions.sendDest);
    return !message ? this.createTripSummaryMsg(tripDetails) : message;
  }

  static async setReason(userId, data) {
    let submission;
    try {
      submission = NewSlackHelpers.dialogValidator(data, tripReasonSchema);
      await Cache.save(getTripKey(userId), 'reason', submission.reason);
      return submission;
    } catch (err) {
      return err;
    }
  }

  static async handlePickUpDetails(user, data) {
    const tripData = await UserTripHelpers.updateTripData(user, data);
    await Cache.saveObject(getTripKey(user.id), tripData);
  }

  static async handleLocationVerfication(user, location, type) {
    const placeIds = await UserTripHelpers.getCachedPlaceIds(user.id);
    const { lat, lng } = await NewLocationHelpers.handleLocationVerfication(placeIds, location);
    const updateTripData = await NewLocationHelpers.updateLocation(
      type, user.id, placeIds[location], lat, lng, location
    );
    await Cache.saveObject(getTripKey(user.id), updateTripData);
    const tripDetails = await Cache.fetch(getTripKey(user.id));
    const message = this.getPostVerficationMsg(type, tripDetails);
    return message;
  }

  static async getCachedPlaceIds(userId) {
    const placeIds = await Cache.fetch(getPredictionsKey(userId));
    return placeIds;
  }

  static getPostVerficationMsg(type, tripDetails) {
    const message = type === 'pickup'
      ? this.createContToDestMsg() : this.createTripSummaryMsg(tripDetails);
    return message;
  }

  static hasErrors(submission) {
    return submission && submission.errors;
  }

  static async handleDestinationDetails(user, data) {
    const { pickup, othersPickup } = await Cache.fetch(getTripKey(user.id));
    const thePickup = pickup === 'Others' ? othersPickup : pickup;
    const submission = NewSlackHelpers.dialogValidator(data,
      createUserDestinationSchema(thePickup));
    const tripDetails = await NewLocationHelpers.getDestinationCoordinates(user.id, submission);
    await Cache.saveObject(getTripKey(user.id), tripDetails);
  }

  static async updateTripData(user, {
    date, time, pickup, othersPickup
  },
  tripType = 'Regular Trip') {
    const userTripDetails = await Cache.fetch(getTripKey(user.id));
    const userTripData = { ...userTripDetails };
    const pickupCoords = await NewLocationHelpers.getCoordinates(pickup);
    if (pickupCoords) {
      const { location: { longitude, latitude }, id } = pickupCoords;
      Object.assign(userTripData, {
        pickupId: id,
        pickupLat: latitude,
        pickupLong: longitude
      });
    }
    Object.assign(userTripData, {
      id: user.id,
      name: user.name,
      dateTime: `${date} ${time}`,
      pickup,
      othersPickup,
      departmentId: userTripDetails.departmentId,
      department: userTripDetails.department,
      tripType
    });
    return userTripData;
  }

  static async savePayment(payload) {
    try {
      const { submission, state } = payload;
      submission.price = parseFloat(submission.price);
      NewSlackHelpers.dialogValidator(submission, tripPaymentSchema);
      const { tripId } = JSON.parse(state);
      const { price } = submission;
      await tripService.updateRequest(tripId, { cost: price });
    } catch (err) {
      return err;
    }
  }
}
