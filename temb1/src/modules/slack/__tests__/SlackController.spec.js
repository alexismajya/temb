import request from 'supertest';
import WebSocketEvents from '../../events/web-socket-event.service';
import { routeService } from '../../routes/route.service';
import UserService from '../../users/user.service';
import app from '../../../app';
import SlackController from '../SlackController';
import { teamDetailsService } from '../../teamDetails/teamDetails.service';
import Response from '../../../helpers/responseHelper';
import BugsnagHelper from '../../../helpers/bugsnagHelper';
import HttpError from '../../../helpers/errorHandler';
import { homebaseService } from '../../homebases/homebase.service';
import SlackHelpers from '../../../helpers/slack/slackHelpers';
import { SlackInteractiveMessage } from '../SlackModels/SlackMessageModels';
import RouteEventHandlers from '../../events/route-events.handlers';
import { mockWhatsappOptions } from '../../notifications/whatsapp/twilio.mocks';
import { routeBatchService } from '../../routeBatches/routeBatch.service';
import TravelTripHelpers from '../../new-slack/trips/travel/travel.helpers';
import TripEventsHandlers from '../../events/trip-events.handlers';
import socketIoMock from '../__mocks__/socket.ioMock';

mockWhatsappOptions();

jest.mock('@slack/client', () => ({
  WebClient: jest.fn(() => ({
    chat: { postMessage: jest.fn(() => Promise.resolve(() => { })) },
    users: {
      info: jest.fn(() => Promise.resolve({
        user: { real_name: 'someName', profile: {} },
        token: 'sdf'
      })),
      profile: {
        get: jest.fn(() => Promise.resolve({
          profile: {
            tz_offset: 'someValue',
            email: 'sekito.ronald@andela.com'
          }
        }))
      }
    },
    conversations: {
      list: jest.fn().mockReturnValue({
        channels: [{
          id: 'CE0F7SZNU',
          name: 'tembea-magicians',
          purpose: {
            value: 'This channel is for workspace-wide communication and announcements.'
          },
        }]
      })
    }
  }))
}));
beforeEach(() => {
  jest.spyOn(TripEventsHandlers, 'getSocketService').mockImplementationOnce(
    () => (new WebSocketEvents(socketIoMock))
  );
});
describe(SlackController, () => {
  beforeEach(() => {
    jest.spyOn(homebaseService, 'getHomeBaseBySlackId').mockResolvedValue(
      { id: 1, name: 'Nairobi', country: { name: 'Kenya' } }
    );
    jest.spyOn(SlackHelpers, 'findOrCreateUserBySlackId').mockReturnValue({});
    jest.spyOn(TravelTripHelpers, 'getStartMessage').mockResolvedValue('FJJFKKDJD');
  });


  it('should return launch message', (done) => {
    request(app)
      .post('/api/v1/slack/command')
      .end((err, res) => {
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty('blocks');
      }, done());
  });

  it('should return the lunch message for the command /Tembea travel', async () => {
    await request(app)
      .post('/api/v1/slack/command')
      .send({ text: 'travel' })
      .then((res) => {
        expect(res.status).toEqual(200);
        expect(res.body).toEqual(expect.any(String));
      });
  });

  it('should return the lunch meassage for the command /Tembea route', async () => {
    await request(app)
      .post('/api/v1/slack/command')
      .send({ text: 'route' })
      .then((res) => {
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty('text');
        expect(res.body).toHaveProperty('attachments');
        expect(res.body).toHaveProperty('response_type');
      });
  });

  describe('getChannels', () => {
    beforeEach(() => {
      jest.spyOn(teamDetailsService, 'getTeamDetailsByTeamUrl').mockResolvedValue({
        botToken: 'xxxxxxx',
      });
    });

    it('should respond with a list slack channels', async () => {
      const res = await request(app)
        .get('/api/v1/slack/channels')
        .set('teamUrl', 'XXXXX');
      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Request was successful');
      expect(res.body).toHaveProperty('data', [{
        id: 'CE0F7SZNU',
        name: 'tembea-magicians',
        description: 'This channel is for workspace-wide communication and announcements.',
      }]);
    });

    it('should fetch all channels on the workspace', async () => {
      jest.spyOn(Response, 'sendResponse').mockReturnValue();
      const req = { query: {} };
      const res = { locals: { botToken: 'token' } };
      await SlackController.getChannels(req, res);
      expect(Response.sendResponse).toHaveBeenCalled();
    });
    it('should handle error occurence', async () => {
      jest.spyOn(BugsnagHelper, 'log').mockReturnValue();
      jest.spyOn(HttpError, 'sendErrorResponse').mockReturnValue();

      const req = { query: {} };
      await SlackController.getChannels(req, {});
      expect(BugsnagHelper.log).toHaveBeenCalled();
      expect(HttpError.sendErrorResponse).toHaveBeenCalled();
    });
    it('should not limit routes to only users with Nairobi Homebase', async () => {
      jest.spyOn(homebaseService, 'getHomeBaseBySlackId').mockResolvedValue(
        { id: 1, name: 'Kampala', country: { name: 'Uganda' } }
      );
      expect(await SlackController.getRouteCommandMsg()).toMatchObject(
        {
          text: '>*`The route functionality is not supported for your current location`*'
            .concat('\nThank you for using Tembea! See you again.')
        }
      );
    });
  });
});

describe(SlackController.leaveRoute, () => {
  it('should remove an engineer from a route', async () => {
    jest.spyOn(UserService, 'getUserBySlackId').mockResolvedValue({
      routeBatchId: 1, name: 'Route name', id: 2
    });
    jest.spyOn(UserService, 'updateUser').mockResolvedValue(null);
    jest.spyOn(routeBatchService, 'getRouteBatchByPk').mockResolvedValue(
      { routeId: 1 }
    );
    jest.spyOn(routeService, 'getRouteById').mockResolvedValue(
      { name: 'Route name' }
    );
    jest.spyOn(RouteEventHandlers, 'handleUserLeavesRouteNotification').mockResolvedValue();
    const payload = { user: { id: 'slackId' } };

    const result = await SlackController.leaveRoute(payload);
    const slackMessage = new SlackInteractiveMessage('Hey <@slackId>, You have successfully left '
      + 'the route `Route name`.');
    expect(result.text).toEqual(slackMessage.text);
  });

  it('should throw an error while removing an engineer from a route', async () => {
    jest.spyOn(BugsnagHelper, 'log').mockReturnValue();
    jest.spyOn(UserService, 'getUserBySlackId').mockRejectedValue(new Error());
    const payload = { user: { id: 'uuuuucu' } };
    expect(SlackController.leaveRoute(payload)).rejects
      .toThrowError(expect.objectContaining({
        message: expect.stringContaining('Something went wrong'),
      }));
  });
});
