import {
    SlackText, ActionBlock, ButtonElement, CancelButtonElement,
  } from '../models/slack-block-models';
import travelTripBlocks from '../trips/travel/blocks';
import TravelTripsActions from '../trips/travel/actions';
import { SlackActionButtonStyles } from '../../slack/SlackModels/SlackMessageModels';

export default class TravelEditHelpers {
  static generateSelectedOption(option: any) {
    const selectedOption = [option.toString()];
    const chosenOption = selectedOption.map((chosen: any) => ({
      text: new SlackText(chosen), value: chosen,
    }));
    return chosenOption;
  }
  static checkIsEditTripDetails(tripDetails: any, isEdit: boolean) {
    const [
      cachedDate, cachedPickup, cachedDestination, cachedTime,
      cachedReason, cachedDateTime, cachedEmbassyVisitDateTime,
    ] = isEdit ? [
      tripDetails.date, tripDetails.pickup, tripDetails.destination,
      tripDetails.time, tripDetails.reason, tripDetails.dateTime,
      tripDetails.embassyVisitDateTime,
    ] : ['', '', '', '', '', '', ''];
    return [
      cachedDate, cachedPickup, cachedDestination, cachedTime, cachedReason,
      cachedDateTime, cachedEmbassyVisitDateTime,
    ];
  }
  static checkIsEditFlightDetails(tripDetails: any, isEdit: boolean) {
    const [
      cachedDate, cachedFlightNumber, cachedTime, cachedPickup,
      cachedDestination, cachedReason, cachedFlightDateTime, cachedDateTime,
    ] = isEdit ? [
      tripDetails.date, tripDetails.flightNumber, tripDetails.time,
      tripDetails.pickup, tripDetails.destination, tripDetails.reason,
      tripDetails.flightDateTime, tripDetails.dateTime,
    ] : ['', '', '', '', '', '', '', ''];
    return [
      cachedDate, cachedFlightNumber, cachedTime, cachedPickup, cachedDestination,
      cachedReason, cachedFlightDateTime, cachedDateTime,
    ];
  }
  static createTravelSummaryMenu(tripPayload: any, tripType: any) {
    const actionBlock = new ActionBlock(travelTripBlocks.confirmTrip).addElements([
      new ButtonElement(new SlackText('Confirm Trip Request'), 'confirm',
        TravelTripsActions.confirmTravel, SlackActionButtonStyles.primary),
      new ButtonElement(new SlackText('Add Trip Note'), tripPayload.tripDetails.tripNotes ? 'udpate_note'
        : 'trip_note', TravelTripsActions.addNote, SlackActionButtonStyles.primary),
      new ButtonElement(new SlackText('Edit Trip Request'), 'edit',
      tripType === 'Airport Transfer'
      ? TravelTripsActions.editTravel
      : TravelTripsActions.editEmbassyVisit, SlackActionButtonStyles.primary),
      new CancelButtonElement('Cancel Travel Request', 'cancel', TravelTripsActions.cancel, {
        title: 'Are you sure?',
        description: 'Are you sure you want to cancel this trip request',
        confirmText: 'Yes',
        denyText: 'No',
      }),
    ]);
    return actionBlock;
  }
}
