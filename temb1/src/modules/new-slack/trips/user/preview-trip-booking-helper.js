import { MarkdownText } from '../../models/slack-block-models';
import Cache from '../../../shared/cache';
import { getTripKey } from '../../../../helpers/slack/ScheduleTripInputHandlers';
import { getSlackDateString } from '../../../slack/helpers/dateHelpers';
import PreviewScheduleTrip
  from '../../../slack/helpers/slackHelpers/previewScheduleTripAttachments';
import { addressService } from '../../../addresses/address.service';


export default class PreviewTripBooking {
  static returnPreview({
    passengerName, passengers, userName,
    pickupName, destinationName, dateTime, department, reason
  }) {
    return [
      new MarkdownText(`*Passenger's Name* \n${passengerName}`),
      new MarkdownText(`*Number of Passengers* \n${passengers}`),
      new MarkdownText(`*Requester (Trip)* \n${userName}`),
      new MarkdownText(`*Pickup Location* \n${pickupName}`),
      new MarkdownText(`*Destination* \n${destinationName}`),
      new MarkdownText(`*Pick-Up Date/Time* \n${getSlackDateString(dateTime)}`),
      new MarkdownText(`*Department* \n${department}`),
      new MarkdownText(`*Reason for Trip* \n${reason}`),
    ];
  }

  static async getRiderName(rider) {
    try {
      const { name } = await PreviewScheduleTrip.getRider(rider);
      return name;
    } catch (err) {
      return err;
    }
  }

  static async saveDistance(tripData, distance) {
    await Cache.save(getTripKey(tripData.id), 'distance', distance);
  }

  static previewDistance(distance, preview) {
    if (distance && distance !== 'unknown') {
      preview.push(new MarkdownText(`*Distance* \n${distance}`));
      return preview;
    }
    return preview;
  }

  static async getPreviewFields(tripDetails) {
    const {
      pickupLat, destinationLat, passengers, department, forMe,
      dateTime, reason, name, pickupLong, destinationLong, rider,
    } = tripDetails;
    const { pickupName, destinationName } = await PreviewTripBooking
      .getOtherPickupAndDestination(tripDetails);
    const userName = PreviewScheduleTrip.formatName(name);
    let passengerName = userName;
    if (!forMe) passengerName = await PreviewTripBooking.getRiderName(rider);
    const preview = PreviewTripBooking.returnPreview({
      reason,
      passengers,
      userName,
      pickupName,
      department,
      dateTime,
      destinationName,
      passengerName,
    });
    if (pickupLat && destinationLat) {
      const distance = await PreviewScheduleTrip
        .getDistance(pickupLat, pickupLong, destinationLat, destinationLong);
      await PreviewTripBooking.saveDistance(tripDetails, distance);
      const previewData = PreviewTripBooking.previewDistance(distance, preview);
      return previewData;
    }
    return preview;
  }

  static async getOtherPickupAndDestination(tripDetails) {
    const {
      othersPickup, othersDestination, pickup, destination
    } = tripDetails;
    let { pickupId: originId, destinationId } = tripDetails;
    if (!originId) {
      ({ id: originId } = await addressService.findOrCreateAddress(othersPickup));
    }
    if (!destinationId) {
      ({ id: destinationId } = await addressService.findOrCreateAddress(othersDestination));
    }
    const pickupName = othersPickup || pickup;
    const destinationName = othersDestination || destination;
    return {
      pickupName, destinationName, originId, destinationId
    };
  }
}
