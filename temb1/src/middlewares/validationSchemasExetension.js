import Joi from '@hapi/joi';
import JoiExtension from '@hapi/joi-date';

const extendedJoi = Joi.extend(JoiExtension);

export const teamUrlRegex = /^(https?:\/\/)?(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*(slack\.com)$/;
export const nameRegex = /^[A-Za-z ,.'-]+$/;
export const numberRegex = /^\+?[0-9]+$/;
export const timeRegex = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
export const startAndEndTime = /^\d{1,2}\s{0,2}(([:]\s{0,2}\d{1,2}\s{0,2})?)\s{0,2}(-)\s{0,2}\d{1,2}\s{0,2}(([:]\s{0,2}\d{1,2}\s{0,2})?)$/;
export const requiredEmail = Joi.string().trim().email().required();
export const requiredCountry = Joi.string().trim().required().regex(/^([a-zA-Z]+\s)*[a-zA-Z]+$/);
export const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
export const Stringregex = /([A-Z])\w+/;
export const headers = Joi.object().keys({
  homebaseid: Joi.number().min(1),
}).pattern(/^.+$/, Joi.optional());

export const phoneNoRegex = /^\+[1-9]\d{6,14}$/;

export const readDepartmentRecords = {
  query: Joi.object().keys({
    page: Joi.number().min(1),
    size: Joi.number().min(1),
    id: Joi.number().min(1),
    providerId: Joi.number().min(1),
    sort: Joi.string(),
    status: Joi.string().valid('Active', 'Inactive'),
    name: Joi.string().replace(/[^a-z0-9\s]/gi, ''),
    country: Joi.string().replace(/[^a-z0-9\s]/gi, ''),
    onRoute: Joi.boolean()
  }),
  headers,
};
const whenConfirm = (type) => Joi.number().when(
  'action', {
    is: 'confirm',
    then: type === 'number' ? Joi.number().required() : Joi.string().trim().required()
  }
);
const whenDecline = Joi.string().when('action', {
  is: 'decline', then: Joi.any().forbidden()
});
const whenConfirmOrDecline = whenConfirm('number').concat(whenDecline);

export const getTripsSchema = Joi.object().keys({
  page: Joi.number(),
  size: Joi.number(),
  status: Joi.string().trim().valid('Confirmed', 'Pending', 'Approved', 'Completed',
    'DeclinedByManager', 'DeclinedByOps', 'InTransit', 'Cancelled'),
  searchterm: Joi.string().empty('').default('').optional()
});
export const tripUpdateSchema = Joi.object().keys({
  action: Joi.string(),
  tripId: Joi.number().required(),
  comment: Joi.string().trim().required(),
  slackUrl: Joi.string().trim().required().regex(teamUrlRegex),
  providerId: whenConfirmOrDecline
});

export const longitude = Joi.number().min(-180).max(180).required();
export const latitude = Joi.number().min(-86).max(86).required();

export const addressSchema = Joi.object().keys({
  address: Joi.string().trim().required().replace(/[^a-z0-9\s,]/gi, ''),
  location: Joi.object().keys({ longitude, latitude }).required().min(2)
    .max(2),
}).required().min(2)
  .max(2);

export const exportToDocument = {
  query: Joi.object().keys({
    table: Joi.string()
      .valid('routes', 'departments', 'tripItinerary', 'pendingRequests', 'routeAnalysis')
      .required(),
    sort: Joi.string(),
    department: Joi.string(),
    dateFilters: Joi.string(),
  }),
  headers,
};

export const from = extendedJoi.date().format('YYYY-MM-DD').iso().label('from')
  .required();

export const to = extendedJoi.date().format('YYYY-MM-DD').iso().min(Joi.ref('from'));
