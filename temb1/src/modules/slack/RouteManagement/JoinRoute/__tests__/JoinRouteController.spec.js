import JoinRouteInteractions from '../JoinRouteInteractions';
import RoutesHelpers from '../../../helpers/routesHelper';
import { routeBatchService } from '../../../../routeBatches/routeBatch.service';
import { homebaseService } from '../../../../homebases/homebase.service';
import { mockWhatsappOptions } from '../../../../notifications/whatsapp/twilio.mocks';

mockWhatsappOptions();

describe('JoinRouteInputHandlers', () => {
  describe('JoinRouteController_sendAvailableRoutesMessage', () => {
    const mockRoutesData = {
      routes: [],
      totalPages: 1,
      pageNo: 1
    };

    let respond;
    beforeEach(() => {
      respond = jest.fn();
      jest.spyOn(RoutesHelpers, 'toAvailableRoutesAttachment');
      jest.spyOn(routeBatchService, 'getRoutes').mockResolvedValue(mockRoutesData);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should display all routes', async () => {
      const payload = { user: { id: 1 } };
      jest.spyOn(homebaseService, 'getHomeBaseBySlackId')
        .mockImplementation(() => ({ id: 1, homebase: 'Kampala' }));
      await JoinRouteInteractions.sendAvailableRoutesMessage(payload, respond);
      expect(RoutesHelpers.toAvailableRoutesAttachment).toBeCalled();
    });
  });
});
