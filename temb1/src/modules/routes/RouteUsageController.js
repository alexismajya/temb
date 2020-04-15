/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable no-plusplus */
import groupArray from 'group-array';
import { batchUseRecordService } from '../batchUseRecords/batchUseRecord.service';
import RouteHelper from '../../helpers/RouteHelper';
import HttpError from '../../helpers/errorHandler';
import BugSnagHelper from '../../helpers/bugsnagHelper';
import Response from '../../helpers/responseHelper';
import { routeService } from './route.service';

class RoutesUsageController {
  /**
   * @description Read the routes batch records
   * @param  {object} req The http request object
   * @param  {object} res The http response object
   * @returns {object} The http response object
   */
  static async getRouteUsage(req, res) {
    try {
      const { from, to } = req.query;
      const values = [];
      const batchUsageRecords = await batchUseRecordService.getRoutesUsage(from, to);
      const { rowCount, rows } = batchUsageRecords;
      if (rows.length === 0) {
        const responses = {
          mostUsedBatch: { Route: 'N/A', percentageUsage: 0 }, leastUsedBatch: { Route: 'N/A', percentageUsage: 0 }
        };
        return Response.sendResponse(res, 200, true, 'Percentage Usage Generated', responses);
      }
      // loop through
      rows.map((item) => values.push(item.name));
      const { mostUsedRoute, numberOfTimes } = RouteHelper.mostUsedRoute(values);
      const { leastUsedRoute, numberOfLeastUsedTime } = RouteHelper.leastUsedRoute(values);
      const mostUsedRoutePercentage = RouteHelper.mostLeastUsedRoutePercentage(numberOfTimes, rowCount);
      const leastUsedRoutePercentage = RouteHelper.mostLeastUsedRoutePercentage(numberOfLeastUsedTime, rowCount);
      return Response.sendResponse(res, 200, true, 'Percentage Usage Generated', {
        mostUsedBatch:
        { Route: mostUsedRoute, percentageUsage: mostUsedRoutePercentage },
        leastUsedBatch: { Route: leastUsedRoute, percentageUsage: leastUsedRoutePercentage }
      });
    } catch (error) {
      BugSnagHelper.log(error);
      return HttpError.sendErrorResponse(error, res);
    }
  }

  static async getRouteRatings(req, res) {
    try {
      const { from, to } = req.query;
      const { homebaseid } = req.headers;
      const data = await routeService.routeRatings(from, to, homebaseid);
      const groupedData = groupArray(data[0], 'Route', 'RouteBatchName');
      const routeAverageRatings = [];
      Object.values(groupedData).forEach((route) => {
        Object.values(route).map((batchRatings) => {
          const sum = batchRatings.reduce((prev, next) => prev + next.rating, 0);
          const avg = sum / batchRatings.length;
          const { RouteBatchName, Route } = batchRatings[0];
          const ratings = {
            RouteBatchName, Route, NumberOfRatings: batchRatings.length, Average: Math.round(avg)
          };
          return routeAverageRatings.push(ratings);
        });
      });
      return Response.sendResponse(res, 200, true, 'Ratings Fetched Successfully',
        routeAverageRatings.sort((a, b) => b.Average - a.Average));
    } catch (error) {
      BugSnagHelper.log(error);
      return HttpError.sendErrorResponse(error, res);
    }
  }
}
export default RoutesUsageController;
