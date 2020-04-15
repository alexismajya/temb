import AuthValidator from './auth.validator';
import SchedulerValidator from './scheduler.validator';

const middleware = {
    SchedulerValidator,
    AuthValidator,
};

export default middleware;
