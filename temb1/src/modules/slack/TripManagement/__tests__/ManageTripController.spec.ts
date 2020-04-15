import ManageTripController from '../ManageTripController';
import slackEvents from '../../events';
import { slackEventNames } from '../../events/slackEvents';
import tripService from '../../../trips/trip.service';
import { departmentService } from '../../../departments/department.service';
import { teamDetailsService } from '../../../teamDetails/teamDetails.service';
import InteractivePrompts from '../../../../modules/slack/SlackPrompts/InteractivePrompts';
import { TripRequest } from '../../../../database';
import { ITestData } from '../../../../setup-jest';
import { TripStatus } from '../../../../database/models/trip-request';

jest.mock('../../SlackPrompts/InteractivePrompts');
jest.mock('../../events/index.js');
jest.mock('../../../teamDetails/teamDetails.service');

afterAll(() => {
  jest.restoreAllMocks();
});

describe('Manage trip controller run validations', () => {
  it('should be able to run validations on empty string', (done) => {
    const res = ManageTripController.runValidation({ declineReason: '        ' });
    expect(res).toEqual([{ name: 'declineReason', error: 'This field cannot be empty' }]);
    done();
  });

  it('should be able to run validations on very long strings', (done) => {
    const res = ManageTripController.runValidation({
      declineReason: `
      xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
      xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxv
    `,
    });
    expect(res).toEqual([
      { name: 'declineReason', error: 'Character length must be less than or equal to 100' },
    ]);
    done();
  });
});

describe('Manage Trip Controller decline trip', () => {
  const { trips } = JSON.parse(process.env.TEST_DATA) as ITestData;
  const tripDepartureTime = new Date(new Date().getTime() - 864000000).toISOString();

  beforeEach(() => {
    jest.spyOn(slackEvents, 'raise').mockReturnValue();
    jest.spyOn(tripService, 'getById')
      .mockImplementation((id) => Promise.resolve({ id, name: 'Test Trip' }));
    jest.spyOn(departmentService, 'getHeadByDeptId')
      .mockResolvedValue({ slackId: 'U123S0' });
    jest.spyOn(teamDetailsService, 'getTeamDetailsBotOauthToken').mockResolvedValue('token');
    jest.spyOn(InteractivePrompts, 'sendManagerDeclineOrApprovalCompletion').mockReturnValue();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should return an error on decline trip request', async () => {
    jest.spyOn(tripService, 'getById').mockRejectedValue();
    const res = jest.fn();

    try {
      await ManageTripController.declineTrip(['timestamp', 'XXXXXXX', 1000],
        'No reason at all', res);
    } catch (err) {
      expect(res).toBeCalledWith({
        text: 'Dang, something went wrong there.',
      });
    }
  });

  it('should decline trip request', async () => {
    await ManageTripController.declineTrip(['timestamp', 'XXXXXXX', trips[1].id],
      'No reason at all', jest.fn());

    expect(slackEvents.raise).toHaveBeenCalledWith(
      slackEventNames.DECLINED_TRIP_REQUEST,
      expect.any(Object), expect.any(Function),
      expect.any(String),
    );
  });
});
