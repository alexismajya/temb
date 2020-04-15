import joi from '@hapi/joi';
export default class JoiHelper {
  static validateSubmission(submission: any, schema: joi.ObjectSchema) {
    const { error, value } = joi.validate(submission, schema, {
      abortEarly: false,
      convert: true,
    });
    if (error) {
      return JoiHelper.handleError(error.details);
    }
    return value;
  }

  static handleError(errorDetails: joi.ValidationErrorItem[]) {
    const errorObject: any = {
      errorMessage: 'Validation error occurred, see error object for details',
    };

    errorDetails.forEach(({ message, type, context: { label } }) => {
      switch (type) {
        case 'any.required':
          errorObject[`${label}`] = `Please provide ${label}`;
          break;
        default:
          errorObject[`${label}`] = `${message}`;
      }
    });
    return errorObject;
  }
}
