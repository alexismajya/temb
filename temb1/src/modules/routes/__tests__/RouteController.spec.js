/* eslint-disable max-len */
import request from 'supertest';
import faker from 'faker';
import WebSocketEvents from '../../events/web-socket-event.service';
import app from '../../../app';
import Utils from '../../../utils';
import RoutesController from '../RouteController';
import RoutesUsageController from '../RouteUsageController';
import { addressService } from '../../addresses/address.service';
import { RoutesHelper } from '../../../helpers/googleMaps/googleMapsHelpers';
import GoogleMapsPlaceDetails from '../../../services/googleMaps/GoogleMapsPlaceDetails';
import { SlackInteractiveMessage } from '../../slack/SlackModels/SlackMessageModels';
import HttpError from '../../../helpers/errorHandler';
import { routeService } from '../route.service';
import RouteRequestService from '../route-request.service';
import { mockRouteRequestData, mockRouteBatchData } from '../../../services/__mocks__';
import Response from '../../../helpers/responseHelper';
import { SlackEvents } from '../../slack/events/slackEvents';
import UserService from '../../users/user.service';
import { routeBatchService } from '../../routeBatches/routeBatch.service';
import { teamDetailsService } from '../../teamDetails/teamDetails.service';
import RouteNotifications from '../../slack/SlackPrompts/notifications/RouteNotifications';
import BugsnagHelper from '../../../helpers/bugsnagHelper';
import { batchUseRecordService } from '../../batchUseRecords/batchUseRecord.service';
import RouteHelper from '../../../helpers/RouteHelper';
import {
  newRoute, newRouteBatch, newRouteUseRecord, formatDate
} from '../__mocks__/routeMock';
import { MockRatings, RatingAverages } from '../__mocks__/mockData';
import database from '../../../database';
import TripEventsHandlers from '../../events/trip-events.handlers';
import socketIoMock from '../../slack/__mocks__/socket.ioMock';

const {
  models: {
    Route, RouteBatch, RouteUseRecord
  }
} = database;
const assertRouteInfo = (body) => {
  expect(body)
    .toHaveProperty('status');
  expect(body)
    .toHaveProperty('takeOff');
  expect(body)
    .toHaveProperty('capacity');
  expect(body)
    .toHaveProperty('batch');
  expect(body)
    .toHaveProperty('inUse');
  expect(body)
    .toHaveProperty('id');
};
beforeEach(() => {
  jest.spyOn(TripEventsHandlers, 'getSocketService').mockImplementationOnce(
    () => (new WebSocketEvents(socketIoMock))
  );
});
describe('RoutesController', () => {
  let validToken;
  beforeAll(() => {
    validToken = Utils.generateToken('30m', { userInfo: { roles: ['Super Admin'] } });
  });
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await database.close();
  });

  describe('deleteRouteBatch()', () => {
    let req;
    let res;
    beforeEach(() => {
      req = {
        params: {
          routeBatchId: 2
        },
        body: {
          teamUrl: 'url.slack.com'
        }
      };
      res = {
        status: jest.fn(() => ({
          json: jest.fn(() => { })
        })).mockReturnValue({ json: jest.fn() })
      };
    });
    it('should delete a routeBatch', async () => {
      jest.spyOn(routeBatchService, 'getRouteBatchByPk').mockResolvedValue(mockRouteBatchData);
      jest.spyOn(routeBatchService, 'deleteRouteBatch').mockImplementation(() => 1);
      jest.spyOn(SlackEvents, 'raise').mockImplementationOnce(() => {});

      await RoutesController.deleteRouteBatch(req, res);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.status().json).toHaveBeenCalledWith({
        message: 'route batch deleted successfully', success: true
      });
    });

    it('should return a not found error', async () => {
      const spy = jest.spyOn(HttpError, 'throwErrorIfNull');
      jest.spyOn(routeBatchService, 'getRouteBatchByPk').mockResolvedValue(false);
      jest.spyOn(routeBatchService, 'deleteRouteBatch').mockResolvedValue(0);

      await RoutesController.deleteRouteBatch(req, res);
      expect(HttpError.throwErrorIfNull).toHaveBeenCalledTimes(1);
      expect(HttpError.throwErrorIfNull).toHaveBeenCalledWith(
        false, 'route batch not found'
      );
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(404);
      spy.mockRestore();
    });
  });
  describe('getAll()', () => {
    let req;
    let res;
    beforeEach(() => {
      req = {};
      res = {
        status: jest.fn(() => ({
          json: jest.fn(() => { })
        })).mockReturnValue({ json: jest.fn() })
      };
    });
    it('should return all route requests', async () => {
      req = { currentUser: { userInfo: { email: 'ddd@gmail.com' } } };
      jest.spyOn(RouteRequestService, 'getAllConfirmedRouteRequests')
        .mockResolvedValue(mockRouteRequestData);
      jest.spyOn(UserService, 'getUserByEmail')
        .mockImplementation(() => ({ homebaseId: 1 }));
      await RoutesController.getAll(req, res);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.status().json).toHaveBeenCalledTimes(1);
      expect(res.status().json).toHaveBeenCalledWith({ routes: mockRouteRequestData });
    });

    it('should throw an Error', async () => {
      jest.spyOn(RouteRequestService, 'getAllConfirmedRouteRequests')
        .mockImplementation(() => {
          throw Error('This is an error');
        });

      await RoutesController.getAll(req, res);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.status().json).toHaveBeenCalledTimes(1);
      expect(res.status().json).toHaveBeenCalledWith({
        message: 'An error has occurred', success: false
      });
    });
  });
  describe('getOne', () => {
    let req;
    let res;
    beforeEach(() => {
      req = {
        params: {
          id: 2
        }
      };
      res = {
        status: jest.fn(() => ({})).mockReturnValue({ json: jest.fn() })
      };
    });
    it('should give error message if route doesnt exist', (done) => {
      request(app)
        .get('/api/v1/routes/178882')
        .set('Content-Type', 'application/json')
        .set('Authorization', validToken)
        .expect(404, (err, response) => {
          const { body } = response;
          expect(body).toHaveProperty('message');
          expect(body).toEqual({ message: 'Route not found', success: false });
          done();
        });
    });
    it('should successfully fetch one routes', async () => {
      jest.spyOn(routeService, 'getRouteById').mockResolvedValue(mockRouteBatchData);
      await RoutesController.getOne(req, res);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.status().json).toHaveBeenCalledTimes(1);
      expect(res.status().json).toHaveBeenCalledWith({
        message: 'Success',
        route: mockRouteBatchData
      });
    });
    it('should give error message if route is not integer', (done) => {
      request(app)
        .get('/api/v1/routes/102ed')
        .set('Content-Type', 'application/json')
        .set('Authorization', validToken)
        .expect(200, (err, response) => {
          const { body } = response;
          expect(body).toHaveProperty('message');
          expect(body).toEqual({
            message: 'Please provide a positive integer value',
            success: false
          });
          done();
        });
    });
  });
  describe('getRoutes', () => {
    it('should successfully fetch routes', (done) => {
      jest.spyOn(UserService, 'getUserByEmail')
        .mockImplementation(() => ({ homebaseId: 1 }));
      request(app)
        .get('/api/v1/routes')
        .set('Content-Type', 'application/json')
        .set('Authorization', validToken)
        .expect(200, (err, res) => {
          const { body } = res;
          expect(body).toHaveProperty('message');
          expect(body).toHaveProperty('data');
          expect(body.data).toHaveProperty('pageMeta');
          expect(body.data).toHaveProperty('routes');
          const { pageMeta: { totalResults } } = body.data;
          expect(typeof totalResults).toBe('number');
          if (body.data.routes.length) {
            assertRouteInfo(body.data.routes[0]);
          }
          done();
        });
    });

    it('should handle internal server error', (done) => {
      jest.spyOn(routeBatchService, 'getRoutes')
        .mockRejectedValue(new Error("Cannot destructure property `botToken` of 'undefined' or 'null'."));
      jest.spyOn(UserService, 'getUserByEmail')
        .mockImplementation(() => ({ homebaseId: 1 }));
      request(app)
        .get('/api/v1/routes')
        .set('Content-Type', 'application/json')
        .set('Authorization', validToken)
        .expect(500, (err, res) => {
          const { body } = res;
          expect(body).toHaveProperty('message');
          expect(body).toHaveProperty('success');
          expect(body).toEqual({ message: "Cannot destructure property `botToken` of 'undefined' or 'null'.", success: false });
          done();
        });
    });
  });
  describe('createRoute', () => {
    const data = {
      routeName: 'Yaba',
      destination: {
        address: 'Some address in Yaba',
        coordinates: {
          lat: 80,
          lng: 176
        }
      },
      takeOffTime: '12:12',
      capacity: 4,
      teamUrl: 'andela-tembea.slack.com',
      provider: {
        id: 1,
        name: 'Provider Test Name',
        providerUserId: 1,
        isDirectMessage: true,
        user: {
          name: 'Allan',
          email: 'provider_email@email.com',
          phoneNo: '+8001111111',
          slackId: 'upng'
        }
      }
    };

    const routeData = {
      batch: {
        id: 1,
        inUse: 1,
        batch: 'A',
        capacity: 4,
        takeOff: '12:12',
        comments: 'EEEEEE',
        imageUrl: 'https://image-url',
        status: 'Inactive'
      }
    };

    it('should successfully duplicate a route', (done) => {
      const mockRoute = { name: 'bay area' };
      const message = 'Successfully duplicated bay area route';
      jest.spyOn(RouteHelper, 'duplicateRouteBatch').mockResolvedValue(
        { batch: mockRoute, routeName: mockRoute.name, botToken: 'gfhj' }
      );
      jest.spyOn(teamDetailsService, 'getTeamDetailsByTeamUrl')
        .mockResolvedValue({ botToken: 'xoop' });

      request(app)
        .post('/api/v1/routes?action=duplicate&batchId=1')
        .set('Content-Type', 'application/json')
        .set('Authorization', validToken)
        .send(data)
        .expect(200, (err, res) => {
          const { body } = res;
          expect(body).toHaveProperty('message');
          expect(body).toHaveProperty('success');
          expect(body).toEqual({ message, success: true, data: mockRoute });
          done();
        });
    });

    it('should successfully create a route', (done) => {
      jest.spyOn(RouteHelper, 'createNewRouteWithBatch').mockResolvedValue(routeData);
      jest.spyOn(teamDetailsService, 'getTeamDetailsByTeamUrl')
        .mockResolvedValue({ botToken: 'xoop' });

      const eventsMock = jest.spyOn(SlackEvents, 'raise').mockImplementation();
      request(app)
        .post('/api/v1/routes')
        .set('Content-Type', 'application/json')
        .set('Authorization', validToken)
        .send(data)
        .expect(200, (err, res) => {
          const { body: { data: route } } = res;
          assertRouteInfo(route);
          expect(route.status).toEqual('Inactive');
          expect(route.takeOff).toEqual('12:12');
          expect(route.capacity).toEqual(4);
          expect(eventsMock).toHaveBeenCalled();
          done();
        });
    });

    it('should handle internal server error', (done) => {
      jest.spyOn(teamDetailsService, 'getTeamDetailsByTeamUrl')
        .mockResolvedValue({ botToken: 'xoop' });
      jest.spyOn(addressService, 'createNewAddress')
        .mockRejectedValue(new Error("Cannot destructure property `botToken` of 'undefined' or 'null'."));
      request(app)
        .post('/api/v1/routes')
        .set('Content-Type', 'application/json')
        .set('Authorization', validToken)
        .send(data)
        .expect(500, (err, res) => {
          const { body } = res;
          expect(body).toHaveProperty('message');
          expect(body).toHaveProperty('success');
          expect(body).toEqual({ message: "Cannot destructure property `botToken` of 'undefined' or 'null'.", success: false });
          done();
        });
    });
  });
  describe('saveDestination', () => {
    const latitude = faker.address.latitude();
    const longitude = faker.address.longitude();
    const coordinates = `${latitude},${longitude}`;
    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    it('should fetch address from database if coordinates has been saved', async () => {
      jest.spyOn(addressService, 'findAddressByCoordinates')
        .mockResolvedValue({ address: 'dummy address' });
      const result = await RoutesController.saveDestination(coordinates);
      expect(addressService.findAddressByCoordinates).toHaveBeenCalledWith(longitude, latitude);
      expect(result).toEqual({ address: 'dummy address' });
    });
    it('should fetch and save address from google maps api', async () => {
      const place = {
        place_id: '',
        geometry: { location: { lat: latitude, lng: longitude } }
      };
      const details = { result: { name: '', formatted_address: '' } };
      const address = `${details.result.name}, ${details.result.formatted_address}`;

      jest.spyOn(RoutesHelper, 'getPlaceInfo')
        .mockResolvedValue(place);
      jest.spyOn(GoogleMapsPlaceDetails, 'getPlaceDetails')
        .mockResolvedValue(details);
      jest.spyOn(addressService, 'createNewAddress')
        .mockResolvedValue('saved');

      const result = await RoutesController.saveDestination(coordinates);

      expect(RoutesHelper.getPlaceInfo).toHaveBeenCalledWith('coordinates', coordinates);
      expect(GoogleMapsPlaceDetails.getPlaceDetails)
        .toHaveBeenCalledWith(place.place_id);
      expect(addressService.createNewAddress)
        .toHaveBeenCalledWith(longitude, latitude, address);

      expect(result).toEqual('saved');
    });
    it('should throw if google maps api could not find address', async () => {
      const place = null;
      jest.spyOn(RoutesHelper, 'getPlaceInfo')
        .mockResolvedValue(place);
      try {
        await RoutesController.saveDestination(coordinates);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpError);
        expect(error.statusCode).toEqual(400);
        expect(error.message).toEqual('Invalid Coordinates');
      }
    });
  });

  describe('RouteController_getRouteUsage', () => {
    let req;
    let res;
    let usageServiceSpy;
    beforeEach(async () => {
      req = {
        query: {
          from: '2019-05-05', to: '2019-05-06'
        }
      };
      res = {
        status: jest.fn(() => ({
          json: jest.fn(() => { })
        })).mockReturnValue({ json: jest.fn() })
      };
      usageServiceSpy = jest.spyOn(batchUseRecordService, 'getRoutesUsage');
      const route = await Route.create(newRoute);
      newRouteBatch.routeId = route.id;
      const routeBatch = await RouteBatch.create(newRouteBatch);
      newRouteUseRecord.batchId = routeBatch.id;
      await RouteUseRecord.create(newRouteUseRecord);
    });
    it('Should return the most and least used routes', async () => {
      const date = formatDate();
      const response = await request(app).get(`/api/v1/routes/status/usage?from=2019-10-21&to=${date}`)
        .set('Authorization', validToken);
      expect(response.status).toEqual(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toEqual('Percentage Usage Generated');
    });

    it('Should catch errors', async () => {
      const error = new Error('Something went wrong');
      usageServiceSpy.mockRejectedValue(error);
      jest.spyOn(BugsnagHelper, 'log');
      jest.spyOn(HttpError, 'sendErrorResponse');
      await RoutesUsageController.getRouteUsage(req, res);
      expect(BugsnagHelper.log).toBeCalled();
      expect(BugsnagHelper.log).toBeCalledWith(error);
      expect(HttpError.sendErrorResponse).toBeCalled();
      expect(HttpError.sendErrorResponse).toBeCalledWith(error, res);
    });
  });
  describe('Route Ratings Controller', () => {
    let res;
    let req;
    beforeEach(() => {
      res = {
        status: jest.fn(() => ({
          json: jest.fn(() => {})
        })).mockReturnValue({ json: jest.fn() })
      };
      req = {
        query: { from: '2019-08-20T07:44:03.574Z', to: '2019-08-20T07:44:03.574Z' },
        headers: {
          homebaseid: 3
        }
      };
    });
    it('should return ratings', async () => {
      jest.spyOn(Response, 'sendResponse');
      jest.spyOn(routeService, 'routeRatings')
        .mockImplementationOnce(() => (MockRatings));
      await RoutesUsageController.getRouteRatings(req, res);
      expect(Response.sendResponse).toBeCalled();
      expect(Response.sendResponse).toBeCalledWith(res, 200, true, 'Ratings Fetched Successfully',
        RatingAverages);
    });

    it('should catch error on get ratings fail', async () => {
      const error = 'Something Went Wrong';
      const ratingsSpy = jest.spyOn(routeService, 'routeRatings');
      ratingsSpy.mockRejectedValue(error);
      jest.spyOn(BugsnagHelper, 'log');
      jest.spyOn(HttpError, 'sendErrorResponse');
      await RoutesUsageController.getRouteRatings(req, res);
      expect(BugsnagHelper.log).toBeCalled();
      expect(BugsnagHelper.log).toBeCalledWith(error);
      expect(HttpError.sendErrorResponse).toBeCalled();
      expect(HttpError.sendErrorResponse).toBeCalledWith(error, res);
    });

    it('should get all ratings from end point', (done) => {
      request(app)
        .get('/api/v1/routes/ratings?from=2019-08-20&to=2019-08-20')
        .set('Content-Type', 'application/json')
        .set('Authorization', validToken)
        .set('homebaseid', 3)
        .expect(200, (err, resp) => {
          const { status, body } = resp;
          expect(status).toEqual(200);
          expect(body).toHaveProperty('success');
          expect(body).toHaveProperty('message');
          expect(body).toHaveProperty('data');
          done();
        });
    });

    it('should should return failure response that demands ratings query URL', (done) => {
      // I pass in invalid query parameter
      request(app)
        .get('/api/v1/routes/ratings?from=201908-20T07:44:03.574Z&to=20190820T07:44:03.574Z')
        .set('Content-Type', 'application/json')
        .set('Authorization', validToken)
        .set('homebaseid', 3)
        .expect(400, (err, resp) => {
          const { status, body } = resp;
          expect(status).toEqual(400);
          expect(body).toHaveProperty('success');
          expect(body).toHaveProperty('message');
          expect(body.success).toEqual(false);
          done();
        });
    });
  });
});

describe('RouteController unit test', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  const reqMock = {
    body: { status: 'Inactive', teamUrl: 'team@slack.com' },
    params: { routeId: 1 }
  };
  describe('Update RouteBatch Details', () => {
    it('should call the response method with success message for route status update', async () => {
      jest.spyOn(Response, 'sendResponse').mockImplementation();
      jest.spyOn(routeBatchService, 'updateRouteBatch').mockResolvedValue(mockRouteBatchData);
      jest.spyOn(routeBatchService, 'getRouteBatchByPk').mockResolvedValue('good');
      const eventsMock = jest.spyOn(SlackEvents, 'raise').mockImplementation();
      const message = 'Route batch successfully updated';

      await RoutesController.updateRouteBatch(reqMock, 'res');
      expect(eventsMock).toHaveBeenCalledTimes(1);
      expect(eventsMock).toHaveBeenCalledWith('notify_route_riders', 'team@slack.com', 'good');
      expect(Response.sendResponse).toHaveBeenCalledTimes(1);
      expect(Response.sendResponse).toHaveBeenCalledWith('res', 200, true, message, 'good');
    });

    it('should call response method with success message for general route update', async () => {
      jest.spyOn(Response, 'sendResponse').mockImplementation();
      jest.spyOn(routeBatchService, 'updateRouteBatch').mockResolvedValue(mockRouteBatchData);
      jest.spyOn(routeBatchService, 'getRouteBatchByPk').mockResolvedValue('good');
      const eventsMock = jest.spyOn(SlackEvents, 'raise').mockImplementation();
      const message = 'Route batch successfully updated';

      await RoutesController.updateRouteBatch(
        { ...reqMock, body: { ...reqMock.body, status: 'Active' } },
        'res'
      );
      expect(eventsMock).toHaveBeenCalledWith('notify_route_riders', 'team@slack.com', 'good');
      expect(Response.sendResponse).toHaveBeenCalledWith('res', 200, true, message, 'good');
    });

    it('should call HTTPError response method when an error is caught', async () => {
      const err = new Error('Try Again');
      jest.spyOn(routeBatchService, 'updateRouteBatch').mockRejectedValue(err);
      const responseMock = jest.spyOn(Response, 'sendResponse').mockImplementation();
      const httpErrorResponseMock = jest.spyOn(HttpError, 'sendErrorResponse').mockImplementation();
      const eventsMock = jest.spyOn(SlackEvents, 'raise').mockImplementation();

      await RoutesController.updateRouteBatch(reqMock, 'res');

      expect(eventsMock).not.toHaveBeenCalled();
      expect(responseMock).not.toHaveBeenCalled();
      expect(httpErrorResponseMock).toHaveBeenCalledTimes(1);
      expect(httpErrorResponseMock).toHaveBeenCalledWith(err, 'res');
    });
  });

  describe('deleteFellowFromRoute', () => {
    let userSpy;
    let notificationSpy;
    let res;
    const req = {
      params: { routeBatchId: 1 },
      body: { teamUrl: 'andela-tembea.slack.com' }
    };

    beforeEach(() => {
      userSpy = jest.spyOn(UserService, 'getUserById');
      notificationSpy = jest.spyOn(RouteNotifications, 'sendNotificationToRider')
        .mockImplementation(jest.fn());
      res = {
        status: jest.fn().mockReturnValue({ json: jest.fn() })
      };
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should remove a fellow successfully from a route and send a notification', async () => {
      jest.spyOn(UserService, 'updateUser').mockImplementation(jest.fn());
      jest.spyOn(teamDetailsService, 'getTeamDetailsByTeamUrl').mockResolvedValue({
        botToken: 'token'
      });
      jest.spyOn(routeBatchService, 'getRouteBatchByPk').mockReturnValue({
        routeId: 1
      });
      jest.spyOn(routeService, 'getRouteById').mockReturnValue({
        routeId: 1,
      });

      userSpy.mockResolvedValue({ routeBatchId: 1, slackId: 'user' });
      const message = new SlackInteractiveMessage(
        '*Hey <@user>, You\'ve been removed from `undefined` route.* \n *:information_source: Reach out to Ops department for any questions*.'
      );

      await RoutesController.deleteFellowFromRoute(req, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.status().json).toBeCalledWith({
        success: true,
        message: 'engineer successfully removed from the route',
        undefined
      });
      expect(notificationSpy).toBeCalledWith(message, 'user', 'token');
    });

    it('should return a message if the user is not on a route', async () => {
      userSpy.mockResolvedValue({ routeBatchId: null, slackId: 'user' });
      await RoutesController.deleteFellowFromRoute(req, res);

      expect(res.status).toBeCalledWith(200);
      expect(res.status().json).toBeCalledWith({
        success: true,
        message: 'user doesn\'t belong to this route',
        undefined
      });
      expect(notificationSpy).not.toBeCalled();
    });

    it('should throw an error if delete fails', async () => {
      const error = new Error('Dummy Error');
      userSpy.mockResolvedValue({ routeBatchId: 2, slackId: 'user' });
      jest.spyOn(UserService, 'updateUser').mockRejectedValue(error);
      const bugsnagSpy = jest.spyOn(BugsnagHelper, 'log')
        .mockImplementation(jest.fn());
      const httpErrorSpy = jest.spyOn(HttpError, 'sendErrorResponse')
        .mockImplementation(jest.fn());

      await RoutesController.deleteFellowFromRoute(req, res);

      expect(bugsnagSpy).toBeCalledWith(error);
      expect(httpErrorSpy).toBeCalledWith(error, res);
    });
  });
});
