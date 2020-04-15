import moment from 'moment';
import Cache from '../modules/shared/cache';
import { addressService } from '../modules/addresses/address.service';
import { getTripKey } from './slack/ScheduleTripInputHandlers';
import tripService from '../modules/trips/trip.service';
import { teamDetailsService } from '../modules/teamDetails/teamDetails.service';
import { providerService } from '../modules/providers/provider.service';

export default class TripHelper {
  static cleanDateQueryParam(query, field) {
    if (query[field]) {
      // departureTime sample data => after,2018-10-10;before,2018-01-10
      const [a, b] = query[field].split(';');
      return this.extracted222(a, b);
    }
  }

  static extracted222(a, b) {
    const result = {};
    const [key1, value1] = this.extracted(a || '');
    if (key1) {
      result[key1] = value1;
    }

    const [key2, value2] = this.extracted(b || '');
    if (key2) {
      result[key2] = value2;
    }
    return result;
  }

  static extracted(a) {
    const [key, value] = a.split(':');
    if (key) {
      return [key, value];
    }
    return [];
  }

  static async updateTripData(userId, name, pickup, othersPickup, dateTime,
    tripType = 'Regular Trip') {
    const userTripDetails = await Cache.fetch(getTripKey(userId));
    const userTripData = { ...userTripDetails };
    const pickupCoords = pickup !== 'Others'
      ? await addressService.findCoordinatesByAddress(pickup) : null;
    if (pickupCoords) {
      userTripData.pickupId = pickupCoords.id;
      userTripData.pickupLat = pickupCoords.location.latitude;
      userTripData.pickupLong = pickupCoords.location.longitude;
    }
    userTripData.id = userId;
    userTripData.name = name;
    userTripData.pickup = pickup;
    userTripData.othersPickup = othersPickup;
    userTripData.dateTime = dateTime;
    userTripData.departmentId = userTripDetails.department.value;
    userTripData.tripType = tripType;
    return userTripData;
  }

  static async getDestinationCoordinates(destination, tripData) {
    const destinationCoords = destination !== 'Others'
      ? await addressService.findCoordinatesByAddress(destination) : null;
    if (destinationCoords) {
      const { location: { longitude, latitude, id } } = destinationCoords;
      const tripDetails = { ...tripData };
      tripDetails.destinationLat = latitude;
      tripDetails.destinationLong = longitude;
      tripDetails.destinationId = id;
      return tripDetails;
    }
    return tripData;
  }

  /**
   * @description Converts approval date format to another format
   * @param {number} approvalDate the approval date in seconds
   * @returns {string} The new approval date in a user-friendly format
   */
  static convertApprovalDateFormat(approvalDate, ts = false) {
    let date = approvalDate;
    if (ts) date *= 1000;
    return moment(
      new Date(date), 'YYYY-MM-DD HH:mm:ss'
    ).toISOString();
  }

  /**
   * @method tripHasProvider
   * @param {object} trip
   * @returns {boolean} Returns true if trip has Provider, false otherwise
   */
  static tripHasProvider(trip) {
    return trip.providerId !== null;
  }

  static async calculateSums(data) {
    const finalValues = { finalCost: 0, finalRating: 0, count: 0 };
    data.forEach((dataObject) => {
      finalValues.count += 1;
      finalValues.finalCost += parseInt(dataObject.totalCost, 10);
      finalValues.finalRating += parseFloat(dataObject.averageRating);
    });
    const { finalRating, count, finalCost } = finalValues;
    const finalAverageRating = (finalRating / count).toFixed(2);
    return { finalCost, finalAverageRating, count };
  }

  static async checkExistence(teamId, providerId, tripId) {
    const provider = await providerService.getProviderById(providerId);
    const trip = await tripService.getById(tripId, true);
    const team = await teamDetailsService.getTeamDetails(teamId);
    let error;
    if (!provider || provider.id !== Number(providerId)) {
      error = 'The Provider is not found';
    } else if (!trip || trip.id !== Number(tripId)) {
      error = 'The trip is not found';
    } else if (!team || team.teamId !== teamId) {
      error = 'The team is not found';
    }
    return error;
  }
}
