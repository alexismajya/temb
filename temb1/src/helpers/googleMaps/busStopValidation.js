import { SlackDialogError } from '../../modules/slack/SlackModels/SlackDialogModels';
import googleMapsHelpers from './index';
import { homebaseService } from '../../modules/homebases/homebase.service';
import HomeBaseHelper from '../HomeBaseHelper';

const validateBusStop = async (otherBusStop, selectBusStop, user) => {
  if (!otherBusStop && !selectBusStop) {
    const error = new SlackDialogError('otherBusStop',
      'One of the fields must be filled.');

    return { errors: [error] };
  }
  if (otherBusStop && selectBusStop) {
    const error = new SlackDialogError('otherBusStop',
      'You can not fill in this field if you selected a stop in the drop down');

    return { errors: [error] };
  }
  const busStop = selectBusStop || otherBusStop;
  if (!googleMapsHelpers.isCoordinate(busStop)) {
    return {
      errors: [
        new SlackDialogError('otherBusStop', 'You must submit a valid coordinate')
      ]
    };
  }

  const homebase = await homebaseService.getHomeBaseBySlackId(user.id, true);
  if (!(await HomeBaseHelper.checkLocationInHomeBase(busStop, homebase))) {
    return {
      errors: [new SlackDialogError(selectBusStop ? 'selectBusStop' : 'otherBusStop',
        'The selected location should be within your homebase country')]
    };
  }
};

export default validateBusStop;
