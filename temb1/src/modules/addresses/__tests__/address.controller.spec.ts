import request from 'supertest';
import '@slack/client';
import WebSocketEvents from '../../events/web-socket-event.service';
import app from '../../../app';
import addressController from '../address.controller';
import { addressService } from '../address.service';
import Utils from '../../../utils';
import TripEventsHandlers from '../../events/trip-events.handlers';
import socketIoMock from '../../slack/__mocks__/socket.ioMock';

describe('/Addresses post request for adding new address', () => {
  let validToken: string;
  const body: any = {};
  let res: any;
  let req: any;
  let req2: any;
  const socket: any = socketIoMock;
  const mockAddress = {
    id: 2,
    address: 'dojo',
    location: {
      id: 3,
      longitude: 10,
      latitude: 72,
    }
  };

  beforeAll(() => {
    validToken = Utils.generateToken('30m', { userInfo: { roles: ['Super Admin'] } });
    jest.spyOn(TripEventsHandlers, 'getSocketService').mockImplementationOnce(
      () => (new WebSocketEvents(socket))
    );
    res = {
      status: jest.fn(() => ({
        json: jest.fn()
      }))
    };
  });

  describe('user input validations', () => {
    it('should respond with a compulsory property not provided', (done) => {
      request(app)
        .post('/api/v1/addresses')
        .send({
          longitude: 9,
          address: 'dojo'
        })
        .set({
          Accept: 'application/json',
          authorization: validToken
        })
        .expect(
          400,
          {
            success: false,
            message: 'Validation error occurred, see error object for details',
            error: { latitude: 'Please provide latitude' }
          },
          done
        );
    });

    it('should respond with invalid longitude', (done) => {
      request(app)
        .post('/api/v1/addresses')
        .send({
          longitude: '1234invalid',
          latitude: 9,
          address: 'dojo'
        })
        .set({
          Accept: 'application/json',
          authorization: validToken
        })
        .expect(
          400,
          {
            success: false,
            message: 'Validation error occurred, see error object for details',
            error: { longitude: 'longitude should be a number' }
          },
          done
        );
    });
  });

  describe('creating new address', () => {
    let addressSpy: jest.SpyInstance<(longitude: number, latitude: number, address: string) => Promise<{
    id: number; address: string; longitude: number; latitude: number;
      isNewAddress: boolean;
    }>>;
    beforeEach(() => {
      req = {
        body: {
          longitude: 12,
          latitude: 9,
          address: 'dojo'
        }
      };
      addressSpy = jest.spyOn(addressService, 'createNewAddress');
    });

    it('should create a valid address successfully', async () => {
      addressSpy.mockResolvedValue(mockAddress);
      await addressController.addNewAddress(req, res)
      expect(addressSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('unsuccessfully creating new address', () => {
    it('should respond unsuccessfully creating address that exists', (done) => {
      request(app)
        .post('/api/v1/addresses')
        .send({
          longitude: 12,
          latitude: 9,
          address: 'dojo'
        })
        .set({
          Accept: 'application/json',
          authorization: validToken
        })
        .expect(
          400,
          {
            message: 'Address already exists',
            data: { address: { address: 'dojo' } } 
          },
          done
        );
    });
  });

  describe('/Addresses update addresses', () => {
    describe('user input validations', () => {
      it('should respond unsuccessfully for missing properties', (done) => {
        request(app)
          .put('/api/v1/addresses')
          .send({ address: 'dojo' })
          .set({
            Accept: 'application/json',
            authorization: validToken
          })
          .expect(
            400,
            {
              success: false,
              message: 'Validation error occurred, see error object for details',
              error: {
                value: '"value" must contain at least one of [newLongitude, newLatitude, newAddress]'
              }
            },
            done
          );
      });

      it('should respond unsuccessfully for invalid properties', (done) => {
        request(app)
          .put('/api/v1/addresses')
          .send({
            newLongitude: '1234invalid',
            newLatitude: 9,
            address: 'dojo'
          })
          .set({
            Accept: 'application/json',
            authorization: validToken
          })
          .expect(
            400,
            {
              success: false,
              message: 'Validation error occurred, see error object for details',
              error: {
                newLongitude: 'newLongitude should be a number'
              }
            },
            done
          );
      });
    });

    describe('updating an address', () => {
      let addressSpy2: jest.SpyInstance<(address: string, newLongitude: number, newLatitude: number, newAddress: string) => Promise<{
        address: string
        }>>;
        beforeEach(() => {
          req = {
            body: {
              newLongitude: 10,
              newLatitude: 9,
              address: 'dojo',
              newAddress: 'dojo1'
            }
          };
          req2 = {
            body: {
              newLongitude: 12,
              newLatitude: 9,
              address: 'dojo',
              newAddress: 'dojo1'
            }
          };
          addressSpy2 = jest.spyOn(addressService, 'updateAddress');
        });

      it('should respond unsuccessfully for address that does not exist', (done) => {
        request(app)
          .put('/api/v1/addresses')
          .send({
            newLongitude: 12,
            newLatitude: 9,
            address: 'does not exist'
          })
          .set({
            Accept: 'application/json',
            authorization: validToken
          })
          .expect(
            404,
            {
              success: false,
              message: 'Address does not exist'
            },
            done
          );
      });

      it('should update a valid address successfully', async () => {
        addressSpy2.mockResolvedValue(mockAddress);
        await addressController.updateAddress(req, res)
        expect(addressSpy2).toHaveBeenCalledTimes(1);
      });

      it('should update only an address successfully', async () => {
        addressSpy2.mockResolvedValue(mockAddress);
        await addressController.updateAddress(req2, res)
        expect(addressSpy2).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('/Addresses get addresses', () => {
    it('should return the first page of addresses', (done) => {
      request(app)
        .get('/api/v1/addresses')
        .set({
          Accept: 'application.json',
          authorization: validToken
        })
        .expect(200, done);
    });

    it('should fail when page does not exist', (done) => {
      request(app)
        .get('/api/v1/addresses?page=99999999999')
        .set({
          Accept: 'application/json',
          authorization: validToken
        })
        .expect(
          404,
          {
            success: false,
            message: 'There are no records on this page.'
          },
          done
        );
    });

    it('pagination should work as expected', (done) => {
      request(app)
        .get('/api/v1/addresses?page=1&size=2')
        .set({
          Accept: 'application.json',
          authorization: validToken
        })
        .expect(200, done);
    });

    it('should fail when invalid query params are used', (done) => {
      request(app)
        .get('/api/v1/addresses?page=gh&size=ds')
        .set({
          Accept: 'application.json',
          authorization: validToken
        })
        .expect(
          400,
          {
            success: false,
            message: {
              errorMessage: 'Validation error occurred, see error object for details',
              page: 'page should be a number',
              size: 'size should be a number'
            }
          },
          done
        );
    });

    it('get single address should work as expected', (done) => {
      request(app)
        .get('/api/v1/addresses/2')
        .set({
          Accept: 'application.json',
          authorization: validToken
        })
        .expect(200, done);
    });

    it('should fail when invalid query params is not postive number', (done) => {
      request(app)
        .get('/api/v1/addresses/-1')
        .set({
          Accept: 'application.json',
          authorization: validToken
        })
        .expect(400,
          {
            success: false,
            message: 'Please provide a positive integer value'
          },
          done);
    });
  });

  describe('AddressController', () => {
    const errorMessage = "Cannot read property 'status' of undefined";
    it('should return error for invalid parameters in addNewAddress', async () => {
      try {
        await addressController.addNewAddress(req, res)
      } catch (error) {
        expect(error.message).toBe(errorMessage);
      }
    });

    it('should return error for invalid parameters in updateAddress', async () => {
      expect(addressController.updateAddress(req, res)).rejects.toThrow(errorMessage);
    });
  });
});
