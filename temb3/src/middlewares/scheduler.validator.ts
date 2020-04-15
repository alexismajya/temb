import { NextFunction, Request, Response } from 'express';
import HttpError from '../helpers/error-handler';
import JoiHelper from '../helpers/joi-helpers';
import { jobSchema } from './validation.schema';

class SchedulerValidator {
  static validateInputs(req: Request, res: Response, next: NextFunction) {
    const data = req.body;
    const validate = JoiHelper.validateSubmission(data, jobSchema);
    if (validate.errorMessage) {
      const { errorMessage, ...rest } = validate;
      return HttpError.handleError(errorMessage, 400, res, { ...rest });
    }
    return next();
  }
}

export default SchedulerValidator;
