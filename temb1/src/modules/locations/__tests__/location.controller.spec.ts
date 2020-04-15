import { LocationController } from '../location.controller';
import { mockLocationService } from '../__mocks__/location.service';
import { mockLogger } from '../../shared/logging/__mocks__/logger';
import { Location } from '../../../database';
import { Response } from 'express';

describe(LocationController, () => {
  let locationController: LocationController;

  const res = ({
    status() {
      return this;
    },
    json() {
      return this;
    },
    send() {
      return this;
    },
  } as unknown) as Response;

  beforeAll(() => {
    locationController = new LocationController(mockLocationService, mockLogger);
  });

  beforeEach(() => {
    jest.spyOn(res, 'status');
    jest.spyOn(res, 'json');
    jest.spyOn(res, 'send');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe(LocationController.prototype.getLocation, () => {
    let testLocation: Location;
    const newReq: any = {
      params: {
        id: 1,
      },
    };
    const { params: { id } } = newReq;

    beforeEach(async () => {
      testLocation = await mockLocationService.createLocation(1.34, 45.45);
      newReq.params.id = testLocation.id;
    });

    it('returns a single location', async () => {
      await locationController.getLocation(newReq, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        location: expect.objectContaining({
          id: testLocation.id,
          longitude: testLocation.longitude,
        }),
      });
    });
  });
});
