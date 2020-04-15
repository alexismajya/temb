import request from 'supertest';
import '@slack/client';
import WebSocketEvents from '../../events/web-socket-event.service';
import app from '../../../app';
import HttpError from '../../../helpers/errorHandler';
import Utils from '../../../utils';
import database from '../../../database';
import { mockWhatsappOptions } from '../../notifications/whatsapp/twilio.mocks';
import TripEventsHandlers from '../../events/trip-events.handlers';
import socketIoMock from '../../slack/__mocks__/socket.ioMock';

mockWhatsappOptions();

const errorMessage = 'Validation error occurred, see error object for details';
let validToken;

beforeAll(() => {
  jest.spyOn(TripEventsHandlers, 'getSocketService').mockImplementationOnce(
    () => (new WebSocketEvents(socketIoMock))
  );
  validToken = Utils.generateToken('30m', { userInfo: { roles: ['Super Admin'] } });
  jest.mock('@slack/client', () => ({
    WebClient: jest.fn(() => ({
      users: {
        lookupByEmail: jest.fn(() => ({
          user: {
            id: 'TEST123',
            profile: {
              real_name: 'Test buddy 1',
              email: 'test.buddy1@andela.com'
            }
          }
        }))
      }
    }))
  }));
});
afterAll(async () => {
  await database.close();
});

describe('/User create', () => {
  it('should respond with a no email provided error', (done) => {
    request(app)
      .post('/api/v1/users')
      .send({
        slackUrl: 'ACME.slack.com'
      })
      .set({
        Accept: 'application/json',
        authorization: validToken
      })
      .expect(
        400,
        {
          success: false,
          message: errorMessage,
          error: { email: 'Please provide email' }
        },
        done()
      );
  });

  it('should respond with invalid email and slack url', (done) => {
    request(app)
      .post('/api/v1/users')
      .set({
        Accept: 'application/json',
        authorization: validToken
      })
      .send({
        email: 'sjnvdsd.com'
      })
      .expect(
        400,
        {
          success: false,
          message: errorMessage,
          error: {
            slackUrl: 'Please provide slackUrl',
            email: 'please provide a valid email address'
          }
        }, done()
      );
  });

  it('should respond with an incomplete info message', (done) => {
    request(app)
      .post('/api/v1/users')
      .set({
        Accept: 'application/json',
        authorization: validToken
      })
      .send({
        email: 'unKnownEmail@test.com'
      })
      .expect(
        400,
        {
          success: false,
          message: errorMessage,
          error: { slackUrl: 'Please provide slackUrl' }
        },
        done()
      );
  });

  it('should respond with invalid slackUrl', (done) => {
    request(app)
      .post('/api/v1/users')
      .set({
        Accept: 'application/json',
        authorization: validToken
      })
      .send({
        email: 'unKnownEmail@test.com',
        slackUrl: 'ACME.sack.co'
      })
      .expect(
        400,
        {
          success: false,
          message: errorMessage,
          error: { slackUrl: 'please provide a valid slackUrl' }
        },
        done()
      );
  });

  it("should respond with can't find slack team", (done) => {
    request(app)
      .post('/api/v1/users')
      .set({
        Accept: 'application/json',
        authorization: validToken
      })
      .send({
        email: 'me.them@andela.com',
        slackUrl: 'ACM.slack.com'
      })
      .expect(
        404,
        {
          success: false,
          message: 'Slack team not found'
        },
        done()
      );
  });

  it('should respond success for existing user', (done) => {
    request(app)
      .post('/api/v1/users')
      .set({
        Accept: 'application/json',
        authorization: validToken
      })
      .send({
        email: 'test.buddy1@andela.com',
        slackUrl: 'ACME.slack.com'
      })
      .expect(200, done());
  });
});

jest.mock('@slack/client', () => ({
  WebClient: jest.fn(() => ({
    users: {
      lookupByEmail: jest.fn(() => ({
        user: {
          id: 'TEST123456',
          profile: {
            real_name: 'newuser',
            email: 'newuser@gmail.com'
          }
        }
      }))
    }
  }))
}));

describe('/User create user who does not exist', () => {
  it('should respond success for non existing user', (done) => {
    request(app)
      .post('/api/v1/users')
      .set('Authorization', validToken)
      .send({
        email: 'newuser@gmail.com',
        slackUrl: 'ACME.slack.com'
      })
      .expect(200, done());
  });

  it('should return an error', async () => {
    const error = new HttpError('error');
    expect(error.message).toEqual('error');
  });

  it('should return an error', async () => {
    const res = {
      status: jest.fn(() => ({
        json: jest.fn(() => { })
      })),
    };
    const error = { message: 'error' };
    const response = HttpError.sendErrorResponse(error, res);
    expect(response).toBeUndefined();
  });
});
