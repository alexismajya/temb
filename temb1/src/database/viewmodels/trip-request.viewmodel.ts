import TripRequest, { TripStatus, TripTypes } from '../models/trip-request';
import { ISerializedTrip, IAddress } from '../models/interfaces/trip-request.interface';
import { ISerializedUser, IUser } from '../models/interfaces/user.interface';
import moment from 'moment';
import { ISerializedProvider } from '../models/interfaces/provider.interface';
import Provider from '../models/provider';
import Utils from '../../utils';

export class TripRequestViewModel implements ISerializedTrip {
  private serializeAddress(address: IAddress) {
    if (address) return address.address;
    return '';
  }

  private serializeUser(user: IUser): ISerializedUser {
    if (user) {
      const { email, slackId, name = Utils.getNameFromEmail(email) } = user;
      return { name, email, slackId };
    }
  }

  private serializeProvider(provider: Provider): ISerializedProvider {
    if (provider) {
      return {
        name: provider.name,
        email: provider.user ? provider.user.email : '',
        phoneNumber: provider.user ? provider.user.phoneNo : '',
      };
    }
  }

  constructor(private readonly trip: TripRequest) { }

  get id () { return this.trip.id; }
  get name () { return this.trip.name; }
  get status () { return this.trip.tripStatus; }
  get arrivalTime () { return this.trip.arrivalTime; }
  get type () { return this.trip.tripType; }
  get approvalDate () { return this.trip.approvalDate; }
  get cab () { return this.trip.cab; }
  get driver () { return this.trip.driver; }
  get homebase () { return this.trip.homebase; }
  get rating () { return this.trip.rating; }
  get operationsComment () { return this.trip.operationsComment; }
  get managerComment () { return this.trip.managerComment; }
  get distance () { return this.trip.distance; }
  get cabId () { return this.trip.cabId; }
  get driverId () { return this.trip.driverId; }
  get passenger () { return this.trip.noOfPassengers; }
  get departureTime () {
    return moment(this.trip.departureTime, 'YYYY-MM-DD HH:mm:ss').toISOString();
  }
  get requestedOn () { return this.trip.createdAt; }
  get department () {
    if (this.trip.department) return this.trip.department.name;
    return '';
  }
  get destination () { return this.serializeAddress(this.trip.destination); }
  get pickup () { return this.serializeAddress(this.trip.origin); }
  get flightNumber () {
    const { tripType } = this.trip;
    if (tripType === TripTypes.airportTransfer) {
      const { tripDetail } = this.trip;
      if (!tripDetail) return '-';
      const { flightNumber } = tripDetail;
      return flightNumber || '-';
    }
  }
  get decliner () { return this.serializeUser(this.trip.decliner); }
  get rider () { return this.serializeUser(this.trip.decliner); }
  get requester () { return this.serializeUser(this.trip.requester); }
  get approvedBy () { return this.serializeUser(this.trip.approver); }
  get confirmedBy () { return this.serializeUser(this.trip.confirmer); }
  get provider () { return this.serializeProvider(this.trip.provider); }
}
