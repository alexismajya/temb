import Joi from '@hapi/joi';
import JoiDate from '@hapi/joi-date';
import moment from 'moment';
import { greaterThan } from './joi.extensions';
import { phoneNoRegex } from '../../../middlewares/validationSchemasExetension';

const joiWithGT = Joi.extend(JoiDate).extend(greaterThan);

export const tripPaymentSchema = Joi.object().keys({
  price: Joi.number().precision(2).min(0).strict()
});

export const tripReasonSchema = Joi.object().keys({
  reason: Joi.string().trim().required()
});

export const customDateError = (errors, timezone,
  format = 'DD/MM/YYYY HH:mm', keys = 'Date and Time') => errors.map((error) => {
  const limit = moment(error.context.limit).tz(timezone).format(format);
  switch (error.type) {
    case 'date.min':
      Object.assign(error, { message: `${keys} cannot be less than ${limit}.` });
      break;
    case 'date.max':
      Object.assign(error, { message: `${keys} cannot be greater than ${limit}.` });
      break;
    case 'date.isoDate':
      Object.assign(error, { message: `${keys} must be in the format ${format}` });
      break;
    default:
      break;
  }
  return error;
});

const getDateAndTime = (timezone) => {
  const fmt = 'YYYY-MM-DD';
  const now = () => moment().tz(timezone);
  const latest = now().add(90, 'days').format(fmt);
  const today = now().format(fmt);
  const timeLimit = now().add(30, 'minutes').format('HH:mm');
  return {
    date: Joi.date().min(today).max(latest).raw()
      .error((errors) => customDateError(errors, timezone, 'MMMM Do, YYYY', 'Date'),
        { self: true }),
    time: joiWithGT.string().regex(/^(2[0-3]|[01][0-9]):[0-5][0-9]$/).when('date', {
      is: today,
      then: joiWithGT.string().greaterThan(timeLimit),
    }).error(() => ({
      message: 'Invalid time'
    })),
  };
};

const customDestinationError = (errors) => errors.map((error) => {
  if (error.type === 'any.invalid') {
    Object.assign(error, { message: 'Destination cannot be the same as origin' });
  }
  return error;
});

export const customOthersError = (field) => (errors) => errors.map((error) => {
  switch (error.type) {
    case 'string.base':
      Object.assign(error, { message: `Others (${field}) must be a valid address string` });
      break;
    case 'string.min':
      Object.assign(error, {
        message: `Others (${field}) must be at least ${error.context.limit} characters long`
      });
    case 'string.max':
      Object.assign(error, {
        message: `Others (${field}) must be not be more than ${error.context.limit} characters long`
      });
    default:
      break;
  }
  return error;
});

const destinationValidator = (pickUp) => Joi.string().required().invalid(pickUp)
  .error(customDestinationError, { self: true });

export const createUserDestinationSchema = (pickUp) => Joi.object().keys({
  destination: destinationValidator(pickUp),
  othersDestination: Joi.string().when('destination', {
    is: 'Others',
    then: destinationValidator(pickUp).min(10).max(50).error(customOthersError('Destination')),
    otherwise: Joi.string().valid(null)
  })
});

export const getDateAndTimeSchema = (timezone) => Joi.object().keys({
  ...getDateAndTime(timezone)
});

export const getTripPickupSchema = (timezone) => Joi.object().keys({
  ...getDateAndTime(timezone),
  pickup: Joi.string().required(),
  othersPickup: Joi.string().when('pickup', {
    is: 'Others',
    then: Joi.string().required().min(5).max(50)
      .error(customOthersError('Pickup')),
    otherwise: Joi.string().valid(null),
  }),
});

export const getTravelTripSchema = (timezone) => getDateAndTimeSchema(timezone)
  .append({
    pickup: Joi.string().required(),
    destination: Joi.string().required(),
    reason: Joi.string().required(),
  });

export const contactDetailsSchema = Joi.object().keys({
  rider: Joi.string().required(),
  department: Joi.string().required(),
  passengers: Joi.number().optional(),
  riderPhoneNo: Joi.string().required().regex(phoneNoRegex).error(() => ({
    message: 'Invalid rider phone number'
  })),
  travelTeamPhoneNo: Joi.string()
    .required()
    .regex(phoneNoRegex)
    .error(() => ({
      message: 'Invalid travel team phone number'
    }))
});

const flightDetailsError = (errors) => errors.map((error) => {
  switch (error.type) {
    case 'any.invalid':
      Object.assign(error,
        { message: 'Pickup and Destination cannot be the same.' });
    default:
      break;
  }
  return error;
});

export const getFlightDetailsSchema = (timezone) => getDateAndTimeSchema(timezone)
  .append({
    flightNumber: Joi.string().required(),
    pickup: Joi.string().required(),
    destination: Joi.string().invalid(Joi.ref('pickup')).required()
      .error(flightDetailsError, { self: true }),
    reason: Joi.string().required()
  });
