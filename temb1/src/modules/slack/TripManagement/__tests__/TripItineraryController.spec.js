import { triggerPage, getPageNumber } from '../TripItineraryController';
import SlackHelpers from '../../../../helpers/slack/slackHelpers';
import DialogPrompts from '../../SlackPrompts/DialogPrompts';
import SlackPagination from '../../../../helpers/slack/SlackPaginationHelper';

jest.mock('../../events/', () => ({
  slackEvents: jest.fn(() => ({
    raise: jest.fn(),
    handle: jest.fn()
  })),
}));

describe('TripItineraryController', () => {
  let respond;

  beforeEach(() => {
    respond = jest.fn((value) => value);
    jest.spyOn(SlackHelpers, 'findOrCreateUserBySlackId')
      .mockImplementation((slackId) => Promise.resolve({
        slackId, name: 'test user'
      }));
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('TripItineraryController  triggerPage', () => {
    it('should sendSkipPage dialog', () => {
      jest.spyOn(DialogPrompts, 'sendSkipPage').mockReturnValue();

      const payload = {
        user: { id: 'TEST123' },
        actions: [{ name: 'skipPage' }]
      };
      triggerPage(payload, respond);
      expect(DialogPrompts.sendSkipPage).toHaveBeenCalled();
    });
  });

  describe('TripItineraryController  getPageNumber', () => {
    beforeEach(() => jest.spyOn(SlackPagination, 'getPageNumber'));

    it('should return a number', () => {
      const payload = {
        submission: 1,
        user: { id: 'TEST123' },
        actions: [{ name: 'page_1' }]
      };
      const res = getPageNumber(payload);
      expect(res).toBeGreaterThanOrEqual(1);
      expect(SlackPagination.getPageNumber).toHaveBeenCalled();
    });

    it('should return a default value of one', () => {
      const payload = { actions: [{ name: 'page_1' }] };
      const res = getPageNumber(payload);
      expect(res).toEqual(1);
    });
  });
});
