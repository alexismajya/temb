/* eslint-disable import/no-unresolved */
import { getCode } from 'country-list';
import flag from 'country-code-emoji';
import { cabService } from '../../modules/cabs/cab.service';
import tripService from '../../modules/trips/trip.service';
import WebClientSingleton from '../../utils/WebClientSingleton';
import { teamDetailsService } from '../../modules/teamDetails/teamDetails.service';
import UserService from '../../modules/users/user.service';
import Cache from '../../modules/shared/cache';

class SlackHelpers {
  static async findUserByIdOrSlackId(userId) {
    const normalizedId = Number.parseInt(userId, 10);
    const user = Number.isInteger(normalizedId)
      ? await UserService.getUserById(normalizedId)
      : await UserService.getUserBySlackId(userId);
    return user;
  }

  static async findOrCreateUserBySlackId(slackId, teamId) {
    const existingUser = await UserService.getUserBySlackId(slackId);
    if (existingUser) return existingUser;
    const user = await SlackHelpers.getUserInfoFromSlack(slackId, teamId);
    user.profile.real_name = user.real_name;
    const newUser = await UserService.createNewUser(user);
    return newUser;
  }

  static async getUserInfoFromSlack(slackId, teamId) {
    const key = `${teamId}_${slackId}`;
    const result = await Cache.fetch(key);
    if (result && result.slackInfo) {
      return result.slackInfo;
    }
    const slackBotOauthToken = await teamDetailsService.getTeamDetailsBotOauthToken(teamId);
    const userInfo = await SlackHelpers.fetchUserInformationFromSlack(slackId, slackBotOauthToken);
    await Cache.save(key, 'slackInfo', userInfo);
    return userInfo;
  }

  static async fetchUserInformationFromSlack(slackId, token) {
    const { user } = await WebClientSingleton.getWebClient(token).users.info({
      user: slackId
    });
    return user;
  }

  static async isRequestApproved(requestId, slackId) {
    let isApproved = false;
    let approvedBy = null;

    const trip = await tripService.getById(requestId);

    if (!trip) {
      return { isApproved: false, approvedBy };
    }

    const { tripStatus, approvedById } = trip;

    if (approvedById && tripStatus && tripStatus.toLowerCase() !== 'pending') {
      isApproved = true;
      const user = await SlackHelpers.findUserByIdOrSlackId(approvedById);
      approvedBy = slackId === user.slackId ? '*You*' : `<@${user.slackId}>`;
    }

    return { isApproved, approvedBy };
  }

  static async approveRequest(requestId, managerId, description) {
    let approved = false;
    const user = await SlackHelpers.findUserByIdOrSlackId(managerId);
    const update = await tripService.updateRequest(requestId, {
      approvedById: user.id,
      managerComment: description,
      tripStatus: 'Approved'
    });

    if (update) { approved = true; }

    return approved;
  }

  static noOfPassengers(startingPoint = 1) {
    const passengerNumbers = [...Array(10)].map(
      (label, value) => ({ text: `${value + startingPoint}`, value: value + startingPoint })
    );
    return passengerNumbers;
  }

  static async handleCancellation(tripRequestId) {
    const { tripStatus } = await tripService.getById(tripRequestId);
    return tripStatus === 'Cancelled';
  }

  static async addMissingTripObjects(updatedTrip) {
    const trip = {};
    if (updatedTrip.declinedById) {
      trip.decliner = await UserService.getUserById(updatedTrip.declinedById);
    }
    if (updatedTrip.confirmedById) {
      trip.confirmer = await UserService.getUserById(updatedTrip.confirmedById);
    }
    if (updatedTrip.cabId) {
      trip.cab = await cabService.getById(updatedTrip.cabId);
    }
    if (updatedTrip.operationsComment) {
      trip.operationsComment = updatedTrip.operationsComment;
    }

    return trip;
  }

  /**
   * @static
   * @param {string} countryName - the name of the location's country
   * @returns {string} location's country flag emoji
   * @description Returns the flag emoji of a location based on location's countryName
   */
  static getLocationCountryFlag(countryName) {
    const code = getCode(countryName);
    return flag(code);
  }
}
export default SlackHelpers;
