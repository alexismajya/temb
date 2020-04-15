import moment from 'moment';
import travelTripsActions from './actions';
import travelTripBlocks from './blocks';
import { IModalResponse, IModalCtx } from '../../helpers/modal.router';
import {
   contactDetailsSchema, getTravelTripSchema,
  getFlightDetailsSchema,
} from '../schemas';
import { getTravelKey } from '../../../slack/helpers/slackHelpers/TravelTripHelper';
import bugsnagHelper from '../../../../helpers/bugsnagHelper';
import { TripTypes } from '../../../../database/models/trip-request';
import { getTimezone } from '../../../slack/helpers/dateHelpers';
import { ActionBlock, ButtonElement, SlackText } from '../../models/slack-block-models';
import TravelHelpers, { ITripPayload } from './travel.helpers';
import Cache from '../../../shared/cache';
import NewSlackHelpers from '../../helpers/slack-helpers';
import Interactions from './interactions';
import Utils from '../../../../utils';
import DateDialogHelper from '../../../../helpers/dateHelper';
import { departmentService as DepartmentService } from '../../../../modules/departments/department.service';
import RescheduleHelper from '../user/reschedule.helper';
import UpdateSlackMessageHelper from '../../../../helpers/slack/updatePastMessageHelper';
import CleanData from '../../../../helpers/cleanData';

export class TravelTripController {
  constructor(
    private readonly bugsnagErrorHelper = bugsnagHelper,
    private readonly travelHelpers = TravelHelpers,
    private readonly cache = Cache,
    private readonly newSlackHelpers = NewSlackHelpers,
    private readonly interactions = Interactions,
    private readonly utils = Utils,
    private readonly dateDialogHelper = DateDialogHelper,
    private readonly departmentService = DepartmentService,
    private readonly rescheduleHelper = RescheduleHelper,
    private readonly updateSlackMessageHelper = UpdateSlackMessageHelper,
  ) {}

  async createTravel(payload: any) {
    let isEdit;
    let tripType;
    switch (payload.actions[0].action_id){
      case travelTripsActions.embassyVisit: case travelTripsActions.editEmbassyVisit:
        tripType = TripTypes.embassyVisit;
        isEdit = payload.actions[0].action_id === travelTripsActions.editEmbassyVisit;
        break;
      case travelTripsActions.airportTransfer: case travelTripsActions.editTravel:
        tripType = TripTypes.airportTransfer;
        isEdit = payload.actions[0].action_id === travelTripsActions.editTravel;
        break;
    }
    await this.cache.save(getTravelKey(payload.user.id), 'tripType',
    tripType);
    const travelDetails = await this.cache.fetch(getTravelKey(payload.user.id));
    await this.interactions.sendContactDetailsModal(payload, travelDetails, isEdit);
  }

  async changeLocation(payload: any, respond: Function) {
    const message = await this.travelHelpers.changeLocation(payload);
    respond(message);

  }

  async selectLocation(payload: any, respond: Function) {
    const message = await this.travelHelpers.selectLocation(payload);
    respond(message);
  }

  cancel(payload: any, respond: Function) {
    respond(this.interactions.simpleTextResponse('Thank you for using Tembea'));
  }

  startTravelTripBooking(payload: any, respond: Function) {
    const message = this.travelHelpers.getStartMessage(payload);
    respond(message);
  }

  async confirmRequest(payload: any, respond: Function) {
    try {
      const { user: { id: userId }, team: { id: teamId } } = payload;
      const tripPayload = await this.cache.fetch(getTravelKey(userId));
      await this.travelHelpers.processTripRequest(tripPayload, { teamId, userId },
      payload.response_url);
    } catch (err) {
      this.bugsnagErrorHelper.log(err);
      respond(this.interactions.simpleTextResponse('Unsuccessful request. Kindly Try again'));
    }
  }

  async addTripNotes(payload: any, respond: any) {
    const addNoteModal =  await this.interactions.sendAddNoteModal(payload);
    respond(addNoteModal);
  }

  async getLocationInfo(payload: any, respond: Function) {
    const tripPayload: ITripPayload = await this.cache.fetch(getTravelKey(payload.user.id));
    const locationModal = await this.interactions.sendLocationModal(payload, tripPayload);
    respond(locationModal);
  }

  async viewTrip(payload: any, respond: Function) {
    const { user: { id: userId }, actions: [{ value }] } = payload;
    const action = new ActionBlock(travelTripBlocks.viewTrip).addElements([
      new ButtonElement(new SlackText('Done'), value, travelTripsActions.viewTripDone),
    ]);
    const tripPayload = await this.cache.fetch(getTravelKey(payload.user.id));
    const tripView = await this.travelHelpers
      .createTravelSummary(tripPayload, userId, true, action);
    respond(tripView);
  }

  async doneViewingTrip(payload: any, respond: Function) {
    const { user: { id: userId }, actions: [{ value }] } = payload;
    const message = this.travelHelpers.getCompletionResponse(userId, value);
    respond(message);
  }

  async submitContactDetails(payload: any, submission: any, respond: IModalResponse,
    context: IModalCtx) {
    try {
      const isEdit = payload.view.callback_id === travelTripsActions.submitEditedContactDetails;
      const validated = this.newSlackHelpers.modalValidator(submission, contactDetailsSchema);
      const { tripType, tripDetails } = await this.cache.fetch(getTravelKey(payload.user.id));
      const tripDetailsModal = await this.travelHelpers.getTripDetailsModal(
        payload, tripDetails, isEdit,
      );
      const flightDetailsModal = await this.travelHelpers.getFlightDetailsModal(
        payload, tripDetails, isEdit,
      );
      const department = await this.departmentService.getById(validated.department);
      await this.cache.save(getTravelKey(payload.user.id), 'contactDetails',
        { ...validated, department });
      if (tripType === 'Airport Transfer') {
        respond.update(flightDetailsModal);
      } else {
        respond.update(tripDetailsModal);
      }
    } catch (err) {
      respond.error(err.errors);
    }
  }

  async submitTripDetails(payload: any, submission: any, respond: IModalResponse,
    context: IModalCtx) {
    try {
      const { user: { id: userId } } = payload;
      const timezone = getTimezone(context.homebase.name);
      const validationSchema = getTravelTripSchema(timezone);
      const validated = this.newSlackHelpers.modalValidator(submission, validationSchema);
      respond.clear();

      const preformattedDate = moment(`${validated.date} ${validated.time}`).format('DD/MM/YYYY HH:mm');
      const pickUpTime = this.utils.removeHoursFromDate(2, preformattedDate);
      const dateTime = this.dateDialogHelper.transformDate(pickUpTime, timezone);
      const embassyVisitDateTime = this.dateDialogHelper.transformDate(preformattedDate, timezone);

      await this.cache.save(getTravelKey(userId), 'tripDetails', { ...validated,
        dateTime, embassyVisitDateTime });

      const tripPayload: ITripPayload = await this.cache.fetch(getTravelKey(userId));
      const tripSummary = await this.travelHelpers.createTravelSummary(tripPayload, userId);
      const { origin: url } = JSON.parse(payload.view.private_metadata);
      await this.updateSlackMessageHelper.sendMessage(url, tripSummary);
    } catch (err) {
      respond.error(err.errors);
    }
  }

  async submitNotes(payload: any, submission: any, respond: IModalResponse,
    context: IModalCtx) {
    const { user: { id: userId } } = payload;

    const tripPayload: ITripPayload = await this.cache.fetch(getTravelKey(userId));
    await this.cache.save(getTravelKey(userId), 'tripDetails', {
      ...tripPayload.tripDetails,
      tripNotes: submission.notes,
    });
    respond.clear();
    const payloadWithNotes = await this.cache.fetch(getTravelKey(userId));
    const tripSummary = await this.travelHelpers.createTravelSummary(payloadWithNotes, userId);
    const { origin: url } = JSON.parse(payload.view.private_metadata);
    await this.updateSlackMessageHelper.sendMessage(url, tripSummary);
  }

  async submitLocationInfo(payload: any, submission: any, respond: IModalResponse,
    context: IModalCtx) {
    const { user: { id: userId }, team: { id: teamId } } = payload;
    const tripPayload: ITripPayload = await this.cache.fetch(getTravelKey(userId));
    await this.cache.save(getTravelKey(userId), 'tripDetails', {
      ...tripPayload.tripDetails,
      ...submission,
    });
    respond.clear();
    const payloadWithLocationInfo = await this.cache.fetch(getTravelKey(userId));
    const { origin: url } = JSON.parse(payload.view.private_metadata);
    await this.travelHelpers.processTripRequest(payloadWithLocationInfo, { teamId, userId },
    url);
  }

  async submitFlightDetails(payload: any, submission: any, respond: IModalResponse,
    context: IModalCtx) {
    try {
      const { user: { id: userId } } = payload;
      const timezone = getTimezone(context.homebase.name);
      const flightDetailsSchema = getFlightDetailsSchema(timezone);
      const validatedData = this.newSlackHelpers.modalValidator(submission, flightDetailsSchema);
      respond.clear();

      const preformattedDate = moment(`${validatedData.date} ${validatedData.time}`)
        .format('DD/MM/YYYY HH:mm');
      const pickupTime = this.utils.removeHoursFromDate(3, preformattedDate);
      const dateTime = this.dateDialogHelper.transformDate(pickupTime, timezone);
      const flightDateTime = this.dateDialogHelper.transformDate(preformattedDate, timezone);

      await this.cache.save(getTravelKey(userId), 'tripDetails', {
        ...validatedData, flightDateTime, dateTime,
      });
      const tripPayload: ITripPayload = await this.cache.fetch(getTravelKey(userId));
      const preview = await this.travelHelpers.createTravelSummary(tripPayload,
        userId);
      const { origin: url } = JSON.parse(payload.view.private_metadata);
      await this.updateSlackMessageHelper.sendMessage(url, preview);
    } catch (error) {
      respond.error(error.errors);
    }
  }

  async handleItineraryActions(data:any, respond: Function) {
    const payload = CleanData.trim(data);
    const { actions: [{ action_id, value }] } = payload;

    let message;
    switch (action_id) {
      case travelTripsActions.viewTrip:
        message = await this.viewTrip(payload, respond);
        break;
      case travelTripsActions.reschedule:
        message = await this.rescheduleHelper.sendTripRescheduleModal(payload, value);
        break;
      case travelTripsActions.cancelTravelTrip:
        message = await this.travelHelpers.cancelTrip(payload, value);
        break;
      default:
        message = this.interactions.goodByeMessage();
    }
    if (message) respond(message);
  }

  async back(payload: any, respond: Function) {
    const { user: { id: slackId }, actions: [{ value: action }] } = payload;

    switch (action) {
      case 'back_to_launch':
        respond(await this.travelHelpers.getStartMessage(slackId));
        break;
      default:
        respond(this.interactions.simpleTextResponse('Thank you for using Tembea'));
        break;
    }
  }
}

const travelTripController = new TravelTripController();
export default travelTripController;
