import { ITripPayload } from './travel.helpers';
import {
  InputBlock, SelectElement, TextInput, Modal, ElementTypes, SlackText, BlockMessage, Block,
} from '../../models/slack-block-models';
import TravelTripsActions from './actions';
import { addressService as AddressService } from '../../../addresses/address.service';
import { teamDetailsService  as TeamDetailsService }
from '../../../teamDetails/teamDetails.service';
import GetSlackViews from '../../extensions/SlackViews';
import { homebaseService as HomebaseService } from '../../../../modules/homebases/homebase.service';
import NewSlackHelpers from '../../helpers/slack-helpers';
import { departmentService as DepartmentService } from '../../../../modules/departments/department.service';

export class Interactions {
  constructor (
    private readonly addressService = AddressService,
    private readonly departmentService = DepartmentService,
    private readonly teamDetailsService = TeamDetailsService,
    private readonly getSlackViews = GetSlackViews,
    private readonly homebaseService = HomebaseService,
    private readonly newSlackHelpers = NewSlackHelpers,
  ) {}

  async sendContactDetailsModal(
    payload: any, travelDetails: any = null, isEdit = false,
  ) {
    const modal = await this.getContactDetailsModal(payload, travelDetails, isEdit);
    const token = await this.teamDetailsService.getTeamDetailsBotOauthToken(payload.team.id);
    return this.getSlackViews(token).open(payload.trigger_id, modal);
  }

  async sendAddNoteModal(payload: any) {
    const modal = this.getAddNoteModal(payload);
    const token = await this.teamDetailsService.getTeamDetailsBotOauthToken(payload.team.id);
    return this.getSlackViews(token).open(payload.trigger_id, modal);
  }

  async sendLocationModal(payload: any, tripData: ITripPayload) {
    const modal = await this.getLocationModal(payload, tripData);
    const token = await this.teamDetailsService.getTeamDetailsBotOauthToken(payload.team.id);
    return this.getSlackViews(token).open(payload.trigger_id, modal);
  }

  static checkIsEditContact(isEdit: boolean, travelDetails: any) {
    const [
      cachedRider, cachedDepartmentId, cachedDepartmentName,
      cachedPassengers, cachedriderPhoneNo, cachedtravelTeamPhoneNo,
    ] = isEdit ? [
      travelDetails.contactDetails.rider, travelDetails.contactDetails.department.id,
      travelDetails.contactDetails.department.name, travelDetails.contactDetails.passengers,
      travelDetails.contactDetails.riderPhoneNo, travelDetails.contactDetails.travelTeamPhoneNo,
    ] : ['', '', '', '', '', ''];
    return [
      cachedRider, cachedDepartmentId, cachedDepartmentName,
      cachedPassengers, cachedriderPhoneNo, cachedtravelTeamPhoneNo,
    ];
  }
  async getContactDetailsModal(payload: any, travelDetails: Object, isEdit: boolean) {
    const [
      cachedRider, cachedDepartmentId, cachedDepartmentName,
      cachedPassengers, cachedriderPhoneNo, cachedtravelTeamPhoneNo,
    ] = Interactions.checkIsEditContact(isEdit, travelDetails);
    const { user: { id: userId } } = payload;
    const homebase = await this.homebaseService.getHomeBaseBySlackId(userId);
    const { rows: departments } = await this.departmentService.getAllDepartments(100, 1,
      homebase.id);
    const selectedDepartment = departments.filter(
        ({ name }) => name === cachedDepartmentName,
      );
    const chosenDepartment = this.newSlackHelpers.toSlackSelectOptions(
      selectedDepartment, { textProp: 'name', valueProp: 'id' },
    );
    const departmentSelect = new SelectElement(
      ElementTypes.staticSelect, 'Select a department', 'department',
       isEdit ? chosenDepartment[0] : null,
    );
    departmentSelect.addOptions(this.newSlackHelpers.toSlackSelectOptions(departments,
      { textProp: 'name', valueProp: 'id' }));
    const modal = Interactions.generateContactDetailsModal(
      payload, isEdit, cachedRider, departmentSelect, cachedPassengers, cachedriderPhoneNo,
      cachedtravelTeamPhoneNo,
    );
    return modal;
  }

  static generateContactDetailsModal(
    payload: any, isEdit: boolean, cachedRider: string, departmentSelect: SelectElement,
    cachedPassengers: any, cachedriderPhoneNo: string, cachedtravelTeamPhoneNo: string,
  ) {
    const rider = new InputBlock(
      new SelectElement(
        ElementTypes.userSelect, 'Select a rider', 'rider', undefined,
        isEdit ? cachedRider : undefined,
      ),
      'For Who?', 'rider');
    const [
      department, passengers, riderPhoneNo, travelTeamPhoneNo,
    ] = Interactions.getRideInfo(
      isEdit, departmentSelect, cachedPassengers, cachedriderPhoneNo, cachedtravelTeamPhoneNo,
    );
    const modal = new Modal(
      isEdit ? 'Edit Contact Details' : 'Contact Details', {
      submit: 'Submit',
      close: 'Cancel',
    }).addBlocks([rider, department, passengers, riderPhoneNo, travelTeamPhoneNo])
      .addCallbackId(isEdit
        ? TravelTripsActions.submitEditedContactDetails : TravelTripsActions.submitContactDetails)
      .addMetadata(JSON.stringify({ origin: payload.response_url }));
    return modal;
  }

  static getRideInfo(
    isEdit: boolean, departmentSelect: SelectElement, cachedPassengers: any,
    cachedriderPhoneNo: string, cachedtravelTeamPhoneNo: string,
  ) {
    const department = new InputBlock(departmentSelect, 'Departments', 'department');
    const passengers = new InputBlock(
      new TextInput(
        'Enter the total number of passengers', 'passengers',
         false, isEdit ? cachedPassengers.toString() : '',
      ),
      'Number of Passengers', 'passengers', false, 'e.g; 2');
    const riderPhoneNo = new InputBlock(
      new TextInput(
        'Enter passenger\'s phone number', 'riderPhoneNo', false, isEdit ? cachedriderPhoneNo : '',
      ),
      'Passenger phone number', 'riderPhoneNo', false, 'e.g +250717665593');
    const travelTeamPhoneNo = new InputBlock(
      new TextInput(
        'Enter travel team phone number', 'travelTeamPhoneNo', false,
        isEdit ? cachedtravelTeamPhoneNo : '',
      ),
      'Travel team phone number', 'travelTeamPhoneNo', false, 'e.g +250717665593');
    return [department, passengers, riderPhoneNo, travelTeamPhoneNo];
  }

  getAddNoteModal(payload: any) {
    const noteField = new InputBlock(
      new TextInput('Eg. I always travel in First Class', 'notes', true),
      'Add Trip Notes', 'notes');
    return new Modal('Trip Notes', { submit: 'Submit', close: 'Cancel' })
      .addBlocks([noteField])
      .addCallbackId(TravelTripsActions.submitNotes)
      .addMetadata(JSON.stringify({ origin: payload.response_url }));
  }

  async getLocationModal(payload: any, tripData: ITripPayload) {
    const pendingLocation = 'To Be Decided';
    const { contactDetails: { rider }, tripDetails: { pickup, destination } } = tripData;
    const embassies = await this.homebaseService.getHomeBaseEmbassies(rider);
    const homebase = await this.homebaseService.getHomeBaseBySlackId(rider);
    const addresses = await this.addressService.getAddressListByHomebase(homebase.name);

    const destinationSelect = new SelectElement(ElementTypes.staticSelect, 'Select an embassy', 'destination');
    destinationSelect.addOptions(this.newSlackHelpers
        .toSlackSelectOptions(embassies, { textProp: 'name', valueProp: 'name' }));

    const pickupSelect = new SelectElement(ElementTypes.staticSelect, 'Select a pickup location', 'pickup');
    pickupSelect.addOptions(addresses
        .map((address: string) => ({ text: new SlackText(address), value: address })));

    const destinationInput = new InputBlock(destinationSelect, 'Destination', 'destination');
    const pickupInput = new InputBlock(pickupSelect, 'Pickup Location', 'pickup');

    const modal = new Modal('Trip Locations', { submit: 'Submit', close: 'Cancel' })
        .addCallbackId(TravelTripsActions.addLocations)
        .addMetadata(JSON.stringify({ origin: payload.response_url }));

    if (pickup === pendingLocation && destination !== pendingLocation) {
      modal.addBlocks([pickupInput]);
    } else if (pickup !== pendingLocation && destination === pendingLocation) {
      modal.addBlocks([destinationInput]);
    } else {
      modal.addBlocks([pickupInput, destinationInput]);
    }
    return modal;
  }

  goodByeMessage() {
    return new SlackText('Thank you for using Tembea. See you again.');
  }

  simpleTextResponse(message: string) {
    return new BlockMessage([new Block().addText(message)]);
  }
}

const interactions = new Interactions();
export default interactions;
