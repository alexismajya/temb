import SchedulerController from '../scheduler.controller';
import mockSchedulerService from '../__mocks__/scheduler.service';
import { Request, Response } from 'express';

describe(SchedulerController, () => {
  let controller: SchedulerController;

  beforeAll(() => {
    controller = new SchedulerController(mockSchedulerService);
  });

  it('should instantiate a scheduler controller', () => {
    expect(controller).toBeDefined();
  });

  describe(SchedulerController.prototype.handle, () => {
    it('should call schedulerService.handle', async () => {
      jest.spyOn(mockSchedulerService, 'handleJob').mockResolvedValue(null);
      const testArgs = {
        req: {} as Request,
        res: {
          send: jest.fn(),
        } as unknown as Response,
      };
      await controller.handle(testArgs.req, testArgs.res);
    });
  });
});
