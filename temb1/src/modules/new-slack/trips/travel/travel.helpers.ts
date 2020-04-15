
import moment from 'moment';
import travelTripBlocks from './blocks';
import TravelTripsActions from './actions';
import userTripActions from '../user/actions';
import {
  SlackText, Block, TextTypes, ButtonElement, BlockMessage,
  ElementTypes, InputBlock, DatePicker, SectionBlock,
  CancelButtonElement, TextInput, Modal, MarkdownText, ActionBlock, SelectElement,
} from '../../models/slack-block-models';
import { SlackActionButtonStyles } from '../../../slack/SlackModels/SlackMessageModels';
import { getTravelKey } from '../../../slack/helpers/slackHelpers/TravelTripHelper';
import { TripStatus } from '../../../../database/models/trip-request';
import { TravelEvents } from '../../../events/travel-events.handlers';
import { checkBeforeSlackDateString } from '../../../slack/helpers/dateHelpers';
import { User, Address } from '../../../../database';
import { addressService as AddressService } from '../../../addresses/address.service';
import NewSlackHelpers, { sectionDivider } from '../../helpers/slack-helpers';
import { homebaseService as HomebaseService } from '../../../homebases/homebase.service';
import Cache from '../../../shared/cache';
import TripService from '../../../trips/trip.service';
import { teamDetailsService as TeamDetailsService }
from '../../../teamDetails/teamDetails.service';
import TripDetailsService from '../../../trips/trip-detail.service';
import UserService from '../../../users/user.service';
import AppEvents from '../../../events/app-event.service';
import SlackHelpers from '../../../../helpers/slack/slackHelpers';
import UpdateSlackMessageHelper from '../../../../helpers/slack/updatePastMessageHelper';
import TravelEditHelpers from '../../helpers/travel-edit-helpers';
import SlackTravelHelpers from '../../helpers/travel-helpers';
export interface ITripPayload {
  tripType: string;
  contactDetails: {
    rider: string;
    department: {
      id: Number,
      name: string,
    };
    requester: string;
    passengers: Number;
    riderPhoneNo: string;
    travelTeamPhoneNo: string;
  };
  tripDetails: {
    id: number;
    date: string;
    pickup: string;
    destination: string;
    time: string;
    reason: string;
    tripNotes: string | null;
    dateTime: string;
    embassyVisitDateTime: string;
    flightDateTime: string;
    flightNumber: string;
  };
}

export interface ITripRelations {
  requester: User;
  rider: User;
  destination: any;
  origin: any;
}

export class TravelHelpers {
  constructor(
    private readonly addressService = AddressService,
    private readonly newSlackHelpers = NewSlackHelpers,
    private readonly homebaseService = HomebaseService,
    private readonly slackHelpers = SlackHelpers,
    private readonly cache = Cache,
    private readonly tripService = TripService,
    private readonly teamDetailsService = TeamDetailsService,
    private readonly tripDetailsService = TripDetailsService,
    private readonly userService = UserService,
    private readonly appEvents = AppEvents,
    private readonly updateSlackMessageHelper = UpdateSlackMessageHelper,
  ) {}

  async getStartMessage(slackId: string) {
    const welcomeMessage = await this.getWelcomeMessage(slackId);
    const headerText = new SlackText(welcomeMessage, TextTypes.markdown);
    const header = new Block().addText(headerText);
    const mainButtons = [
      new ButtonElement(new SlackText('Airport Transfer'), 'airportTransfer',
        TravelTripsActions.airportTransfer, SlackActionButtonStyles.primary),
      new ButtonElement(new SlackText('Embassy Visit'), 'embassyVisit',
        TravelTripsActions.embassyVisit, SlackActionButtonStyles.primary),
      new ButtonElement(new SlackText('Change Location'), 'changeLocation',
        TravelTripsActions.changeLocation, SlackActionButtonStyles.primary),
      this.newSlackHelpers.getCancelButton(userTripActions.cancel),
    ];
    const newTripBlock = new ActionBlock(travelTripBlocks.start);
    newTripBlock.addElements(mainButtons);

    const blocks = [header, newTripBlock];
    const message = new BlockMessage(blocks);
    return message;
  }

  async getTripDetailsModal(payload: any, tripDetails: any, isEdit: boolean) {
    const [
      cachedDate, cachedPickup, cachedDestination, cachedTime, cachedReason,
    ] = TravelEditHelpers.checkIsEditTripDetails(tripDetails, isEdit);
    const {
      destinationSelect, pickupSelect,
    } = await this.getTripDetailsSelects(payload, cachedPickup, cachedDestination, isEdit);
    const defaultDate = moment().format('YYYY-MM-DD');
    const destination = new InputBlock(destinationSelect, 'Destination', 'destination');
    const pickup = new InputBlock(pickupSelect, 'Pickup Location', 'pickup');
    const appointmentDate = new InputBlock(
      new DatePicker(isEdit ? cachedDate : defaultDate, 'select a date',
      'date'), 'Interview Date', 'date');
    const appointmentTime = new InputBlock(
      new TextInput('HH:mm', 'time', false, isEdit ? cachedTime : ''), 'Interview Time',
      'time');
    const textarea = new InputBlock(new TextInput('Enter reason for booking the trip',
      'reason', true, isEdit ? cachedReason : ''), 'Reason', 'reason');
    return new Modal(isEdit ? 'Edit Trip Details' : 'Trip Details', {
      submit: 'Submit',
      close: 'Cancel',
    }).addBlocks([pickup, destination, appointmentDate, appointmentTime, textarea])
      .addCallbackId(TravelTripsActions.submitTripDetails)
      .addMetadata(payload.view.private_metadata);
  }

  async createTravelSummary(tripPayload: ITripPayload, userSlackId: string,
    useActions?: Boolean, customActions?: ActionBlock) {
    const { tripType } = tripPayload;
    const header = new Block().addText(new MarkdownText('*Trip request preview*'));
    const [trip, hoursBefore] = tripType === 'Airport Transfer'
    ? ['flight', 3] : ['appointment', 2];
    const NB = new SectionBlock().addText(new MarkdownText(`*N.B.* Pickup time is fixed at ${hoursBefore} hrs before ${trip} time`));
    const contactInfo = this.createContactInfoBlock(userSlackId, tripPayload);
    const tripInfo = this.createTripInfoBlock(tripPayload);
    let actions;
    const actionBlock = TravelEditHelpers.createTravelSummaryMenu(tripPayload, tripType);
    actions =  useActions ? customActions : actionBlock;

    return new BlockMessage(
      [header, NB, sectionDivider, contactInfo, tripInfo, actions], '',
      `Hello, <@${userSlackId}>, here is your trip preview`);
  }

  async processTripRequest(tripPayload: ITripPayload,
    opts: { teamId: string, userId: string }, responseUrl: string) {
    const pendingLocation = 'To Be Decided';
    const botToken = await this.teamDetailsService.getTeamDetailsBotOauthToken(opts.teamId);
    const {
      contactDetails: { rider: userSlackId }, tripDetails: { destination, pickup },
    } = tripPayload;

    if (destination === pendingLocation || pickup === pendingLocation) {
      const confimLocationMessage =
      this.sendRiderlocationConfirmNotification(tripPayload);
      await this.updateSlackMessageHelper.sendMessage(responseUrl, confimLocationMessage);
    } else {
      const [requester, rider, destinazion, origin] = await Promise.all([
        await this.userService.getUserBySlackId(opts.userId),
        await this.userService.getUserBySlackId(userSlackId),
        await this.addressService.findOrCreateAddress(destination),
        await this.addressService.findOrCreateAddress(pickup),
      ]);
      const trip = await this.createTripRequest(tripPayload, {
        requester,
        rider,
        origin,
        destination: destinazion,
      });
      const completionMessage = this.getCompletionResponse(userSlackId, trip.id);
      await this.updateSlackMessageHelper.sendMessage(responseUrl, completionMessage);
      // save tirp id to cache
      const tripDetailsWithId = {
        ...tripPayload.tripDetails,
        id: trip.id,
      };
      await this.cache.save(getTravelKey(userSlackId), 'tripDetails', tripDetailsWithId);

      this.appEvents.broadcast({
        name: TravelEvents.travelCompletedNewTrip,
        data: {
          botToken,
          data: trip,
        },
      });
    }
  }

  sendRiderlocationConfirmNotification(data: any) {
    const { contactDetails: { rider }, tripDetails: { pickup, destination } } = data;

    const pendingLocation = 'To Be Decided';
    let header;
    if (pickup === pendingLocation && destination !== pendingLocation) {
      header = new Block().addText(new MarkdownText('Please confirm your *pickup* location'));
    } else if (pickup !== pendingLocation && destination === pendingLocation) {
      header = new Block().addText(new MarkdownText('Please confirm your *destination* location'));
    } else {
      header = new Block().addText(new MarkdownText('Please confirm your *pickup* and *destination* locations'));
    }

    const actions = new ActionBlock(travelTripBlocks.confirmLocation).addElements([
      new ButtonElement(new SlackText('Submit destination'), 'destination',
        TravelTripsActions.submitDestination),
      new CancelButtonElement('Cancel Travel Request', 'cancel', TravelTripsActions.cancel, {
        title: 'Are you sure?',
        description: 'Are you sure you want to cancel this travel request',
        confirmText: 'Yes',
        denyText: 'No',
      }),
    ]);

    const message = new BlockMessage([header, actions], '', `<@${rider}>,
    please complete location information for your requested trip`);
    return message;
  }

  private createTripRequest = async (tripPayload: ITripPayload, opts: ITripRelations) => {
    const details = this.getDetailsFromPayload(tripPayload);
    const { id: detailsId } = await this.tripDetailsService.createDetails(details);
    const tripRequest = this.getRequestPropsFromPayload(tripPayload, detailsId, opts);
    return this.tripService.createRequest(tripRequest);
  }

  private getWelcomeMessage = async (slackId: string) => {
    const welcome = 'Welcome to Tembea! :tembea';
    const homeBaseMessage = await this.newSlackHelpers.getHomeBaseMessage(slackId);
    const tembeaGreeting = '*I am your trip operations assistant at Andela*\nWhat would you like to do today?';
    return `${welcome}\n${homeBaseMessage}\n${tembeaGreeting}`;
  }

  private getRequestPropsFromPayload = (tripPayload: ITripPayload,
    detailsId: Number, opts: ITripRelations) => ({
      tripDetailId: detailsId,
      tripType: tripPayload.tripType,
      tripStatus: TripStatus.pending,
      name: `From ${tripPayload.tripDetails.pickup} to ${tripPayload.tripDetails.destination} on `
        + `${tripPayload.tripDetails.dateTime}`,
      noOfPassengers: tripPayload.contactDetails.passengers,
      reason: tripPayload.tripDetails.reason,
      departureTime: tripPayload.tripDetails.dateTime,
      tripNote: tripPayload.tripDetails.tripNotes,
      riderId: opts.rider.id,
      departmentId: tripPayload.contactDetails.department.id,
      requestedById: opts.requester.id,
      homebaseId: opts.requester.homebase.id,
      originId: opts.origin.id,
      destinationId: opts.destination.id,
      distance: '',
    })

  private getDetailsFromPayload = (payload: ITripPayload) => ({
    riderPhoneNo: payload.contactDetails.riderPhoneNo,
    travelTeamPhoneNo: payload.contactDetails.travelTeamPhoneNo,
    flightNumber: payload.tripDetails.flightNumber,
  })

  private createContactInfoBlock(userSlackId: string, payload: ITripPayload) {
    return new SectionBlock().addFields([
      new MarkdownText(`*Passenger*\n<@${userSlackId}>`),
      new MarkdownText(`*Passenger\'s Phone Number*\n${payload.contactDetails.riderPhoneNo}`),
      new MarkdownText(`*Department*\n${payload.contactDetails.department.name}`),
      new MarkdownText(`*Number of Passengers*\n${payload.contactDetails.passengers}`),
      new MarkdownText(`*Travel Team Phone Number*\n${payload.contactDetails.travelTeamPhoneNo}`),
    ]);
  }

  private createTripInfoBlock(payload: ITripPayload) {
    const { tripType, tripDetails } = payload;
    const timeFieldName = `${tripType === 'Airport Transfer' ? 'Flight' : 'Appointment'} Time`;
    const travelDateTime = tripDetails.flightDateTime || tripDetails.embassyVisitDateTime;

    const fields = [
      new MarkdownText(`*Trip Type*\n${tripType}`),
      new MarkdownText(`*Pickup Location*\n${tripDetails.pickup}`),
      new MarkdownText(`*Destination*\n${tripDetails.destination}`),
      new MarkdownText(`*Pickup Time*\n${checkBeforeSlackDateString(tripDetails.dateTime)}`),
      new MarkdownText(`*${timeFieldName}*\n${checkBeforeSlackDateString(travelDateTime)}`),
      new MarkdownText(`*Trip Notes*\n${tripDetails.tripNotes || 'No trip notes'}`),
    ];
    if (tripDetails.flightNumber) fields.push(new MarkdownText(`*Flight Number* \n${tripDetails.flightNumber}`));
    return new SectionBlock().addFields(fields);
  }

  private async getTripDetailsSelects(
    payload: any, cachedPickup: string, cachedDestination: string, isEdit: boolean,
  ) {
    const chosenDestination = TravelEditHelpers.generateSelectedOption(cachedDestination);
    const chosenPickup = TravelEditHelpers.generateSelectedOption(cachedPickup);

    const destinationSelect = new SelectElement(
      ElementTypes.externalSelect, 'Select an embassy', 'destination',
      isEdit ? chosenDestination[0] : null,
    );
    const pickupSelect = new SelectElement(
      ElementTypes.externalSelect, 'Select a pickup location', 'pickup',
      isEdit ? chosenPickup[0] : null,
    );
    return { destinationSelect, pickupSelect };
  }

  async changeLocation(payload: any) {
    const slackId = payload.user.id;
    const homeBases = await this.homebaseService.getAllHomebases(true);
    const userHomeBase = await this.homebaseService.getHomeBaseBySlackId(slackId);
    const filteredHomeBases = this.homebaseService.filterHomebase(userHomeBase, homeBases);
    const headerText = new SlackText('Please choose your current location', TextTypes.markdown);
    const header = new Block().addText(headerText);
    const mainBlock = filteredHomeBases.map((homeBase: any) => {
      const homeBaseCountryFlag = this.slackHelpers.getLocationCountryFlag(homeBase.country.name);
      return new ButtonElement(`${homeBaseCountryFlag} ${homeBase.name}`, homeBase.id.toString(),
        `${TravelTripsActions.changeLocation}_${homeBase.id}`, SlackActionButtonStyles.primary);
    });
    const locationBlock = new ActionBlock(travelTripBlocks.selectLocation);
    locationBlock.addElements(mainBlock);
    const navigation = this.getTripNavBlock('back_to_launch');
    const blocks = [header, locationBlock, navigation];
    const message = new BlockMessage(blocks);
    return message;
  }

  getTripNavBlock(value:any) {
    return this.newSlackHelpers.getNavBlock(travelTripBlocks.navBlock,
      TravelTripsActions.back, value);
  }

  async selectLocation(payload: any) {
    const { user: { id: slackId }, actions: [{ value: homebaseId }] } = payload;
    await this.userService.updateDefaultHomeBase(slackId, Number(homebaseId));
    return this.getStartMessage(slackId);
  }

  async getFlightDetailsModal(payload: any,  tripDetails: any, isEdit: boolean) {
    const [
      cachedDate, cachedFlightNumber, cachedTime, cachedPickup, cachedDestination, cachedReason,
    ] = TravelEditHelpers.checkIsEditFlightDetails(tripDetails, isEdit);
    const { pickupSelect, destinationSelect } = await this.getDestinationSelection(
      payload, cachedPickup, cachedDestination, isEdit,
    );
    const [
      pickup, destination, flightNumber, flightDate, time, textarea,
    ] = SlackTravelHelpers.generateFlightDetailsModal(
      isEdit, pickupSelect, destinationSelect, cachedFlightNumber,
      cachedDate, cachedTime, cachedReason,
    );
    return new Modal(
      isEdit ? 'Edit Flight Details' : 'Flight Details',
      {
        submit: 'Submit',
        close: 'Cancel',
      }).addBlocks([flightNumber, flightDate, time, pickup, destination, textarea])
      .addCallbackId(TravelTripsActions.submitFlightDetails)
      .addMetadata(payload.view.private_metadata);
  }

  private async getDestinationSelection(
    payload: any, cachedPickup: string, cachedDestination: string, isEdit: boolean,
  ) {
    const { user: { id: userId } } = payload;
    const homebase = await this.homebaseService.getHomeBaseBySlackId(userId);
    const addresses = await this.addressService.getAddressListByHomebase(homebase.name);
    const toBeDecidedOption = { text: new SlackText('Decide later'), value: 'To Be Decided' };

    const chosenDestination = TravelEditHelpers.generateSelectedOption(cachedDestination);
    const chosenPickup = TravelEditHelpers.generateSelectedOption(cachedPickup);
    const pickupSelect = new SelectElement(ElementTypes.externalSelect, 'Select a pickup location', 'pickup', isEdit ? chosenPickup[0] : null);
    const destinationSelect = new SelectElement(ElementTypes.staticSelect, 'Select destination', 'destination', isEdit ? chosenDestination[0] : null);

    destinationSelect.addOptions([toBeDecidedOption,
      ...addresses.map((address: any) => ({
        text: new SlackText(address), value: address,
      }))]);
    return { pickupSelect, destinationSelect };
  }

  getCompletionResponse(riderId: string, tripId: number) {
    const headerText = new MarkdownText(`Success! Trip request for <@${riderId}> has been submitted.`);
    const header = new SectionBlock().addText(headerText);
    const actionButtons = new ActionBlock(travelTripBlocks.bookedTrip).addElements(
      [new ButtonElement(new SlackText('View'), `${tripId}`,
        TravelTripsActions.viewTrip, SlackActionButtonStyles.primary),
        new ButtonElement(new SlackText('Reschedule'), `${tripId}`,
        TravelTripsActions.reschedule, SlackActionButtonStyles.primary),
        new CancelButtonElement('Cancel Trip', `${tripId}`,
        TravelTripsActions.cancelTravelTrip, {
          title: 'Are you sure?',
          description: 'Are you sure you want to cancel this trip?',
          confirmText: 'Yes',
          denyText: 'No',
        }),
        this.newSlackHelpers.getCancelButton(TravelTripsActions.cancel),
      ]);

    const message = new BlockMessage([header, actionButtons]);
    return message;
  }

  async cancelTrip(payload: any, tripId: any) {
    let message;
    try {
      const trip = await this.tripService.getById(Number(tripId), true);

      if (!trip) {
        message = 'Trip not found';
      } else {
        await this.tripService.updateRequest(tripId, { tripStatus: 'Cancelled' });
        const {
          origin: { address: originAddress },
          destination: { address: destinationAdress },
        } = trip;

        message = `Success! Your Trip request from ${originAddress} to ${destinationAdress} has been cancelled`;
        // Raise slack events to notify manager and ops that the trip has been cancelled

        this.appEvents.broadcast({
          name: TravelEvents.travelCancelledByRider,
          data: { data: { payload, trip } },
        });
      }
    } catch (error) {
      message = `Request could not be processed, ${error.message}`;
    }
    return new MarkdownText(message);
  }
}

const travelHelpers = new TravelHelpers();
export default travelHelpers;
