import sequelize from 'sequelize';
import { routeService } from './../../routes/route.service';
import { routeBatchService } from '../routeBatch.service';
import RouteBatch from '../../../database/models/route-batch';
import { mockRouteBatchData, routeBatchInstance, routeBatchObject } from '../../../services/__mocks__';

describe('RouteBatch service', () => {
  beforeEach(async () => {
    await routeService.createRoute({
      name: 'new name',
      imageUrl: 'ulr of the image',
      destinationId: 1,
    });
    await routeBatchService.createRouteBatch({
      routeId: 1,
      capacity: 4,
      status: 'Active',
      takeOff: 'DD:DD',
      batch: 'A',
    });
  });

  it('should create a RouteBatch', async () => {
    jest.spyOn(RouteBatch, 'create').mockResolvedValue(mockRouteBatchData);
    const routeBatch = await routeBatchService.createRouteBatch(routeBatchObject);
    expect(routeBatch).toEqual(mockRouteBatchData);
  });

  it('should get a routeBatch by Id', async () => {
    jest.spyOn(RouteBatch, 'findByPk').mockResolvedValue(routeBatchInstance[1]);
    const routeBatch = await routeBatchService.findById(1);
    expect(routeBatch).toEqual(routeBatchInstance[1].get({ plain: true }));
  });

  it('should get RouteBatches', async () => {
    jest.spyOn(RouteBatch, 'findAll').mockResolvedValue([routeBatchInstance[1]]);
    const routeBatchDetails = await routeBatchService.getRouteBatches({ status: 'Active' });
    expect(routeBatchDetails).toEqual([routeBatchInstance[1].get({ plain: true })]);
  });

  it('should update a routeBatch record', async () => {
    const routeBatchDetails = await routeBatchService.updateRouteBatch(1, { status: 'Inactive' });
    expect(routeBatchDetails).toHaveProperty('id', 1);
    expect(routeBatchDetails).toHaveProperty('status', 'Inactive');
  });
  it('should get a RouteBatch record by Pk', async () => {
    jest.spyOn(RouteBatch, 'findByPk').mockResolvedValue(routeBatchInstance[1]);
    const routeBatchDetails = await routeBatchService.getRouteBatchByPk(1, true);
    expect(routeBatchDetails).toEqual(routeBatchInstance[0].get());
  });

  it('should delete a routeBatch record', async () => {
    jest.spyOn(RouteBatch, 'destroy').mockResolvedValue(2);
    const result = await routeBatchService.deleteRouteBatch(1);
    expect(result).toEqual(2);
  });
  describe('RouteService_getRoutes', () => {
    beforeEach(() => {
      jest
        .spyOn(RouteBatch, 'findAll')
        .mockResolvedValue([routeBatchInstance[0]]);
      jest.spyOn(RouteBatch, 'count').mockResolvedValue(10);
      jest.spyOn(sequelize, 'fn').mockImplementation(() => 0);
    });
    it('should get', async () => {
      const result = await routeBatchService.getRoutes();
      expect(result).toEqual({
        pageMeta: {
          page: 1, pageSize: 4294967295, totalPages: 1, totalResults: 10,
        },
        routes: [{
          batch: 'A',
          capacity: 1,
          comments: 'EEEEEE',
          destination: 'BBBBBB',
          imageUrl: 'https://image-url',
          inUse: 1,
          name: 'ZZZZZZ',
          regNumber: 'CCCCCC',
          riders: routeBatchInstance[0].get().riders,
          status: 'Active',
          takeOff: 'DD:DD',
        }],
      });
    });
  });
});
