import Sequelize from 'sequelize';
import database from '../../../../database';
import SlackHelpers from '../../../users/user.service';
import tripService from '../../../trips/trip.service';
import { TripStatus } from '../../../../database/models/trip-request';

const { models: { User, Address } } = database;
const { Op } = Sequelize;
const includeQuery = [
  {
    model: Address,
    as: 'origin',
    attributes: ['address']
  },
  {
    model: Address,
    as: 'destination',
    attributes: ['address']
  },
  {
    model: User,
    as: 'requester',
    attributes: ['name', 'slackId']
  },
  {
    model: User,
    as: 'rider',
    attributes: ['name', 'slackId']
  }
];

class TripItineraryHelper {
  static async getUserIdBySlackId(slackId) {
    const user = await SlackHelpers.getUserBySlackId(slackId);
    if (!user) {
      throw new Error('User not found');
    }
    return user.id;
  }

  static getThirtyDaysFromNow() {
    const difference = Date.now() - 2592000000;
    return difference;
  }

  static getTripItineraryFilters(requestType, userId, tripStatus) {
    const difference = TripItineraryHelper.getThirtyDaysFromNow();
    const filterTripsItinerary = {
      [Op.eq]: Sequelize.where(
        Sequelize.fn('date', Sequelize.col('departureTime')), requestType === 'upcoming'
          ? { [Op.gte]: Sequelize.fn('NOW') }
          : {
            [Op.and]: [
              { [Op.lte]: Sequelize.fn('NOW') }, { [Op.gte]: new Date(difference) }
            ]
          }
      ),
      [Op.or]: [{ riderId: userId }, { requestedById: userId }],
      tripStatus: { [Op.or]: tripStatus }
    };

    return filterTripsItinerary;
  }

  static async getPaginatedTripRequestsBySlackUserId(slackUserId,
    requestType = 'upcoming', pageNo) {
    const tripStatus = requestType === 'upcoming'
      ? [TripStatus.pending, TripStatus.approved, TripStatus.confirmed]
      : [TripStatus.completed];
    const userId = await TripItineraryHelper.getUserIdBySlackId(slackUserId);
    const tripItineraryFilters = TripItineraryHelper.getTripItineraryFilters(
      requestType, userId, tripStatus
    );
    const filters = {
      raw: true,
      where: tripItineraryFilters,
      include: includeQuery
    };
    const paginatedTrips = await tripService.getPaginatedTrips(filters, pageNo);
    return paginatedTrips;
  }
}

export default TripItineraryHelper;
