import Joi from '@hapi/joi';
import { phoneNoRegex } from '../../middlewares/validationSchemasExetension';

// validate inputs when a provider confirms by assigning a driver and a cab to a trip
export const confirmTripSchema = {
  body: Joi.object().keys({
    teamId: Joi.string().trim().required(),
    providerId: Joi.number().integer().positive().required(),
    tripId: Joi.number().integer().positive().required(),
    driverName: Joi.string().min(3).max(25).required(),
    driverPhoneNo: Joi.string().trim().required().regex(phoneNoRegex),
    vehicleModel: Joi.string().trim().min(3).max(50).required(),
    vehicleRegNo: Joi.string().trim().min(3).max(50).required(),
    vehicleColor: Joi.string().trim().replace(/[^a-z0-9\s]/gi, ''),
  }),
};
