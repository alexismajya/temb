/* eslint-disable import/no-unresolved */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-plusplus */
import { addressService } from '../modules/addresses/address.service';
import locationService from '../modules/locations/location.service';
import { routeService } from '../modules/routes/route.service';
import { cabService } from '../modules/cabs/cab.service';
import { providerService } from '../modules/providers/provider.service';
import { expectedCreateRouteObject } from '../utils/data';
import RouteRequestService from '../modules/routes/route-request.service';
import { routeBatchService } from '../modules/routeBatches/routeBatch.service';

export default class RouteHelper {
  static checkRequestProps(createRouteRequest) {
    const receivedProps = Object.keys(createRouteRequest);

    return expectedCreateRouteObject.reduce((acc, item) => {
      if (!receivedProps.includes(item)) {
        acc = `${acc}, ${item}`; // eslint-disable-line no-param-reassign
      }
      return acc;
    }, '');
  }

  static findPercentageUsage(record, allUsageRecords, dormantRouteBatches) {
    const usageRecords = Object.values(record);
    const confirmedRecords = usageRecords
      .filter((confirmed) => confirmed.userAttendStatus === 'Confirmed');
    const batchUsage = {};
    const { RouteBatchName, Route } = record[0];
    batchUsage.Route = Route;
    batchUsage.RouteBatch = RouteBatchName;
    batchUsage.users = usageRecords.length;
    if (!confirmedRecords.length) {
      batchUsage.percentageUsage = 0;
      dormantRouteBatches.push(batchUsage);
      return dormantRouteBatches;
    }
    const percentageUsage = (confirmedRecords.length / usageRecords.length) * 100;
    batchUsage.percentageUsage = Math.round(percentageUsage);
    allUsageRecords.push(batchUsage);
    return allUsageRecords;
  }

  static reducerHelper(prev, current, attribute, status) {
    if (status === 'min') {
      return prev[attribute] < current[attribute] ? prev : current;
    }
    return prev[attribute] > current[attribute] ? prev : current;
  }

  static checkNumberValues(value, field) {
    const isInter = Number.isInteger(parseInt(value, 10));
    const isGreaterThanZero = parseInt(value, 10) > 0;

    if (isInter && isGreaterThanZero) return [];
    return [`${field} must be a non-zero integer greater than zero`];
  }

  static async checkThatAddressAlreadyExists(address) {
    const existingAddress = await addressService.findAddress(address);
    return !!existingAddress;
  }

  static async checkThatLocationAlreadyExists(coordinates) {
    let location;
    if (coordinates) {
      const { lat: latitude, lng: longitude } = coordinates;
      location = await locationService.findLocation(longitude, latitude);
    }
    return !!location;
  }

  static async checkThatVehicleRegNumberExists(vehicleRegNumber) {
    const cab = await cabService.findByRegNumber(vehicleRegNumber);
    return [!!cab, cab];
  }

  static async checkThatRouteNameExists(name) {
    const route = await routeService.getRouteByName(name);
    return [!!route, route];
  }

  static async checkThatProviderIdExists(providerId) {
    const provider = await providerService.getProviderById(providerId);
    return [!!provider];
  }

  static async createNewRouteWithBatch(data, botToken) {
    const {
      routeName, destination: { address, location, coordinates }, takeOffTime, capacity,
      providerId,
      imageUrl
    } = data;

    const [latitude, longitude] = location
      ? [location.latitude, location.longitude]
      : [coordinates.lat, coordinates.lng];

    const destinationAddress = await addressService.createNewAddress(longitude, latitude, address);

    const routeObject = {
      name: routeName, imageUrl, destinationId: destinationAddress.id
    };

    const { route } = await routeService.createRoute(routeObject);

    const batchData = {
      capacity,
      takeOff: takeOffTime,
      providerId,
      routeId: route.id
    };
    const batch = await routeService.createRouteBatch(batchData, botToken, true);
    return { route, batch };
  }

  static async createNewRouteBatchFromSlack(submission, routeRequestId, botToken) {
    const routeRequest = await RouteRequestService.findByPk(routeRequestId, true);
    const {
      routeName, takeOffTime, routeCapacity: capacity, providerId
    } = submission;

    const { routeImageUrl: imageUrl, busStop: destination } = routeRequest;
    const data = {
      routeName,
      destination,
      takeOffTime,
      capacity,
      providerId,
      imageUrl
    };
    return RouteHelper.createNewRouteWithBatch(data, botToken);
  }

  static async duplicateRouteBatch(id, botToken) {
    const routeBatch = await routeBatchService.getRouteBatchByPk(id, true);
    if (!routeBatch) {
      return 'Route does not exist';
    }
    const batch = await RouteHelper.cloneBatchDetails(routeBatch, botToken);
    return { batch, routeName: routeBatch.route.name };
  }

  static async cloneBatchDetails(routeBatch, botToken) {
    const batch = await routeService.createRouteBatch(routeBatch, botToken, false);
    return batch;
  }

  static async updateRouteRequest(routeId, data) {
    await RouteRequestService.update(routeId, data);

    const updatedRequest = await RouteRequestService.findByPk(routeId, true);
    return updatedRequest;
  }

  /**
   * @description This validator checks to ensure that the route request status can be modified
   * @param  {Object} req The request object
   * @param  {Object} res The response object
   * @param  {function} next The next middleware
   */
  static validateRouteStatus(routeRequest) {
    const { status } = routeRequest;

    if (status === 'Approved' || status === 'Declined') {
      return `This request has already been ${status.toLowerCase()}`;
    }

    if (status !== 'Confirmed') {
      return 'This request needs to be confirmed by the manager first';
    }

    return true;
  }

  static batchObject(routeBatch, batch) {
    const { takeOff, capacity, status } = routeBatch;
    const data = {
      takeOff,
      capacity,
      status,
      batch
    };
    return data;
  }

  static pageDataObject(result) {
    const pageData = {
      pageMeta: {
        totalPages: result.totalPages,
        page: result.pageNo,
        totalResults: result.totalItems.length,
        pageSize: result.itemsPerPage
      },
      routes: result.routes
    };
    return pageData;
  }

  /**
   *
   * @param {values} values
   * @returns {object} Object
   */
  static mostUsedRoute(values) {
    let repetionTimes = 0;
    let numberOfTimes = null;
    let repetitionElement;
    for (let i = 0; i < values.length; i++) {
      for (let j = 0; j < values.length; j++) {
        if (values[i] === values[j]) {
          repetionTimes++;
          if (numberOfTimes < repetionTimes) {
            numberOfTimes = repetionTimes;
            repetitionElement = values[i];
          }
        }
      }
      repetionTimes = 0;
    }
    return {
      mostUsedRoute: repetitionElement,
      numberOfTimes
    };
  }

  /**
 *
 * @param {values} values
 * @returns {object}
 */
  static leastUsedRoute(values) {
    const result = [...values.reduce((acc, current) =>
      acc.set(current, (acc.get(current) || 0) + 1), new Map())]
      .reduce((acc, curr) => (curr[1] < acc[1] ? curr : acc));
      // get the route that appear less times
    return {
      leastUsedRoute: result[0],
      numberOfLeastUsedTime: result[1]
    };
  }

  /**
   *
   * @param {rowCount} rowCount
   * @param {NumberOfTimes} NumberOfTimes
   * @returns {Number}
   */
  static mostLeastUsedRoutePercentage(NumberOfTimes, rowCount) {
    const divide = Number(NumberOfTimes) / Number(rowCount);
    const percentage = divide * 100;
    const verifyNumber = isNaN(percentage) ? 'N/A' : percentage;
    return (Math.round(verifyNumber * 100) / 100).toFixed(1);
  }
}
