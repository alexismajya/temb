import faker from 'faker';
import mainValidator, { validateProperties } from '../mainValidor';
import joiHelper from '../../helpers/JoiHelper';
import { updateDepartment } from '../ValidationSchemas';

describe('Main validator', () => {
  let req;
  let res;
  let next;
  const email = faker.internet.email();

  beforeEach(() => {
    res = {
      status: jest.fn(() => ({
        json: jest.fn(),
      })).mockReturnValue({ json: jest.fn() }),
    };
    req = {
      method: 'random',
      body: {
        name: 'Updated Department',
        headEmail: 1,
        homebaseId: 1,
      },
      params: { id: 1 },
    };
    next = jest.fn(() => {});
  });

  describe('Request properties validator', () => {
    it('should validate the body of the request and return validation messages', (done) => {
      const joiHelperSpy = jest.spyOn(joiHelper, 'validateSubmission');
      const errorObject = validateProperties(req, updateDepartment);
      expect(joiHelperSpy).toHaveBeenCalled();
      expect(errorObject).toEqual({
        errorMessage: 'Validation error occurred, see error object for details',
        errors: {
          headEmail: 'headEmail must be a string',
          homebaseId: 'homebaseId is not allowed'
        },
        success: false
      });
      done();
    });

    it('should validate the body successfully', (done) => {
      const joiHelperSpy = jest.spyOn(joiHelper, 'validateSubmission');
      req.body = {
        name: 'Updated Department',
        headEmail: email,
      };
      const errorObject = validateProperties(req, updateDepartment);
      expect(joiHelperSpy).toHaveBeenCalled();
      expect(errorObject).toEqual({ success: true });
      done();
    });
  });

  describe('Main validator', () => {
    it('fails because of unsupported method', (done) => {
      const callbackFunction = mainValidator(updateDepartment);
      callbackFunction(req, res, next);
      expect(res.status).toHaveBeenCalledWith(405);
      expect(res.status().json).toHaveBeenCalledWith({
        message: 'Http method Not Allowed',
        success: false
      });
      done();
    });
    it('validates the body and returns an error message', (done) => {
      req.method = 'put';
      const joiHelperSpy = jest.spyOn(joiHelper, 'validateSubmission');
      const callbackFunction = mainValidator(updateDepartment);
      callbackFunction(req, res, next);
      expect(joiHelperSpy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.status().json).toHaveBeenCalledWith({
        message: 'Validation error occurred, see error object for details',
        success: false,
        error: {
          headEmail: 'headEmail must be a string',
          homebaseId: 'homebaseId is not allowed'
        }
      });
      expect(next).toHaveBeenCalledTimes(0);
      done();
    });

    it('validates the body successfully', (done) => {
      req.method = 'put';
      req.body = {
        name: 'Updated Department',
        headEmail: email,
      };
      const joiHelperSpy = jest.spyOn(joiHelper, 'validateSubmission');
      const callbackFunction = mainValidator(updateDepartment);
      callbackFunction(req, res, next);
      expect(joiHelperSpy).toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      done();
    });
  });
});
