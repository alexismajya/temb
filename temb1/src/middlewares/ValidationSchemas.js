import Joi from '@hapi/joi';
import {
  teamUrlRegex,
  nameRegex,
  timeRegex,
  requiredEmail,
  requiredCountry,
  dateRegex,
  Stringregex,
  phoneNoRegex,
  readDepartmentRecords,
  getTripsSchema,
  tripUpdateSchema,
  addressSchema,
  longitude,
  latitude,
  from,
  to,
  exportToDocument,
} from './validationSchemasExetension';

export const userUpdateSchema = Joi.object().keys({
  slackUrl: Joi.string().trim().required().regex(teamUrlRegex),
  email: Joi.string().trim().email().required(),
  newEmail: Joi.string().trim().email(),
  newName: Joi.string().trim().regex(nameRegex),
  newPhoneNo: Joi.string().trim().regex(phoneNoRegex)
}).or('newEmail', 'newName', 'newPhoneNo');

export const deleteUserSchema = Joi.object().keys({
  email: requiredEmail
});

export const newUserSchema = Joi.object().keys({
  slackUrl: Joi.string().trim().required().regex(teamUrlRegex),
  email: requiredEmail
});

const ViableProviderSchema = Joi.object().keys({
  id: Joi.number().required(),
  name: Joi.string().trim().required(),
  providerUserId: Joi.number().required(),
  isDirectMessage: Joi.boolean().required(),
  channelId: Joi.string().allow(null).optional(),
  vehicles: Joi.array(),
  drivers: Joi.array(),
  homebaseId: Joi.number(),
  user: Joi.object().keys({
    name: Joi.string().trim(),
    phoneNo: Joi.string().trim().allow(null).optional()
      .regex(phoneNoRegex),
    email: Joi.string().trim().email(),
    slackId: Joi.string().trim()
  })
});

export const newRouteSchema = Joi.object().keys({
  routeName: Joi.string().trim().required().replace(/[^a-z0-9\s]/gi, ''),
  destination: Joi.object().keys({
    address: Joi.string().trim().required().replace(/[^a-z0-9\s,]/gi, ''),
    coordinates: Joi.object().keys({
      lng: longitude,
      lat: latitude
    }).required(),
  }).required(),
  teamUrl: Joi.string().trim().required().regex(teamUrlRegex),
  destinationInputField: Joi.string().trim(),
  provider: ViableProviderSchema.required(),
  takeOffTime: Joi.string().trim().required().regex(timeRegex),
  capacity: Joi.number().required().min(1)
});

export const updateRouteSchema = Joi.object().keys({
  teamUrl: Joi.string().trim().required().regex(teamUrlRegex),
  status: Joi.string().trim().valid('Inactive', 'Active'),
  batch: Joi.string().trim(),
  capacity: Joi.number().min(1),
  takeOff: Joi.string().trim().regex(timeRegex),
  providerId: Joi.number().min(1),
  regNumber: Joi.string().trim().replace(/[^a-z0-9\s]/gi, ''),
  name: Joi.string().trim().replace(/[^a-z0-9\s]/gi, '')
});

export const declineRouteRequestSchema = Joi.object().keys({
  newOpsStatus: Joi.string().trim().valid('approve', 'decline').required(),
  comment: Joi.string().trim().required().replace(/[^a-z0-9\s]/gi, ''),
  teamUrl: Joi.string().trim().required().regex(teamUrlRegex),
});

export const approveRouteRequestSchema = Joi.object().keys({
  teamUrl: Joi.string().trim().required().regex(teamUrlRegex),
  newOpsStatus: Joi.string().trim().valid('approve', 'decline').required(),
  comment: Joi.string().trim().required().replace(/[^a-z0-9\s]/gi, ''),
  routeName: Joi.string().trim().required().replace(/[^a-z0-9\s]/gi, ''),
  takeOff: Joi.string().trim().regex(timeRegex).required(),
  provider: ViableProviderSchema.required()
});

export const deleteRouteSchema = Joi.object().keys({
  teamUrl: Joi.string().trim().required().regex(teamUrlRegex)
});

export const assignRoleSchema = Joi.object().keys({
  email: requiredEmail,
  roleName: Joi.string().trim().required(),
  homebaseId: Joi.number().required()
});

export const getRoleSchema = Joi.object().keys({ email: requiredEmail });

export const newRoleSchema = Joi.object().keys({
  roleName: Joi.string().trim().required().replace(/[^a-z0-9\s]/gi, '')
});

export const updateProviderSchema = Joi.object().keys({
  id: Joi.number().required(),
  name: Joi.string().trim(),
  email: Joi.string().trim().email()
}).or('name', 'email');

export const newProviderSchema = Joi.object().keys({
  email: Joi.string().trim().email().required(),
  name: Joi.string().trim().required(),
  notificationChannel: Joi.string().required(),
  channelId: Joi.string().allow(null, '').optional(),
  phoneNo: Joi.string().required().regex(phoneNoRegex),
});

export const newHomeBaseSchema = Joi.object().keys({
  homebaseName: Joi.string().trim().required(),
  countryId: Joi.number().required(),
  channel: Joi.string().trim().required(),
  address: addressSchema,
  currency: Joi.string().trim().required(),
  opsEmail: Joi.string().trim().email().required(),
  travelEmail: Joi.string().trim().email().required(),
}).min(7).max(7);

export const updateHomeBaseSchema = Joi.object().keys({
  countryId: Joi.number().optional(),
  homebaseName: Joi.string().trim().optional(),
  channel: Joi.string().trim().optional(),
  currency: Joi.string().trim().optional(),
  opsEmail: Joi.string().trim().email().optional(),
  travelEmail: Joi.string().trim().email().optional()
}).min(1);

export const newDriverSchema = Joi.object().keys({
  driverPhoneNo: Joi.string().required().regex(phoneNoRegex),
  driverName: Joi.string().trim().required(),
  driverNumber: Joi.string().trim().required().min(3),
  providerId: Joi.number().required(),
  email: Joi.string().trim().email(),
  userId: Joi.number()
});

export const updateDriverSchema = Joi.object().keys({
  driverPhoneNo: Joi.string().regex(phoneNoRegex),
  driverName: Joi.string().trim(),
  driverNumber: Joi.string().trim().min(3),
  email: Joi.string().trim().email(),
  userId: Joi.number().optional()
}).min(1);

export const addDepartment = {
  body: Joi.object().keys({
    name: Joi.string().trim().required().replace(/[^a-z\s-]/gi, ''),
    email: requiredEmail,
    slackUrl: Joi.string().trim().required().regex(teamUrlRegex),
    homebaseId: Joi.number().required()
  })
};

export const updateDepartment = {
  body: Joi.object().keys({
    name: Joi.string().trim().replace(/[^a-z\s-]/gi, '').required(),
    headEmail: Joi.string().trim().email().required(),
  }).min(1).max(2),
  params: Joi.object().keys({ id: Joi.number() }),
};

export const deleteDepartmentOrCountry = {
  body: Joi.object().keys({
    id: Joi.number().min(1),
    name: Joi.string().trim().replace(/[^a-z0-9\s-]/gi, '')
  }).min(1).max(2)
};

export const countrySchema = Joi.object().keys({ name: requiredCountry });

export const updateCountrySchema = Joi.object().keys({
  name: requiredCountry,
  newName: requiredCountry
});

export const newCabSchema = Joi.object().keys({
  regNumber: Joi.string().trim().replace(/[^a-z0-9\s]/gi, '').required(),
  providerId: Joi.number().required().min(1),
  capacity: Joi.number().min(1).required(),
  model: Joi.string().trim().required().replace(/[^a-z0-9\s]/gi, ''),
  color: Joi.string().trim().replace(/[^a-z\s-]/gi, '')
});

export const updateCabSchema = Joi.object().keys({
  id: Joi.number().min(1).required(),
  regNumber: Joi.string().trim().replace(/[^a-z0-9\s]/gi, '').required(),
  capacity: Joi.number().min(1),
  model: Joi.string().trim().replace(/[^a-z0-9\s]/gi, '')
}).min(1);

export const newAddressSchema = Joi.object().keys({
  longitude: Joi.number().min(-180).max(180).required(),
  latitude: Joi.number().min(-86).max(86).required(),
  address: Joi.string().trim().required().replace(/[^a-z0-9\s,]/gi, '')
});

export const updateAddressSchema = Joi.object().keys({
  newLongitude: Joi.number().min(-180).max(180),
  newLatitude: Joi.number().min(-86).max(86),
  address: Joi.string().trim().required().replace(/[^a-z0-9\s,]/gi, ''),
  newAddress: Joi.string().trim().replace(/[^a-z0-9\s,]/gi, '')
}).or('newLongitude', 'newLatitude', 'newAddress');

export const fetchDepartmentTrips = {
  body: Joi.object().keys({
    startDate: Joi.string().required().regex(dateRegex)
      .error(() => 'StartDate must be in the format YYYY-MM-DD and is required'),
    endDate: Joi.string().required().regex(dateRegex)
      .error(() => 'endDate must be in the format YYYY-MM-DD and is required'),
    departments: Joi.array().required()
  }),
  query: Joi.object().keys({
    tripType: Joi.string().valid('Embassy Visit', 'Airport Transfer', 'Regular Trip')
      .regex(Stringregex).required()
      .error(() => 'tripType must be either Embassy Visit, Airport Transfer or Regular Trip'),
  }),
  headers: Joi.object().keys({
    homebaseid: Joi.number().min(1).required(),
  }).pattern(/^.+$/, Joi.optional())
};

export const travelTripSchema = Joi.object().keys({
  startDate: Joi.date().iso().label('start Date').required(),
  endDate: Joi.date().iso().min(Joi.ref('startDate'))
    .label('end Date')
    .required(),
  departmentList: Joi.array().items(Joi.string().trim().label('Departments')).min(1).allow(null)
    .optional()
});

/* The "and" in this validation makes sure that both "from" and "to" fields are
 supplied or none is supplied. In which case, it it will load data from the previous month.
 Also, extendedJoi was used to incoporate .format('YYYY-MM-DD') */
export const dateRangeSchema = Joi.object().keys({ from, to }).and('from', 'to').required();
const routeRequestUsage = { query: dateRangeSchema };

export default {
  phoneNoRegex,
  readDepartmentRecords,
  getTripsSchema,
  tripUpdateSchema,
  userUpdateSchema,
  newUserSchema,
  newRouteSchema,
  updateRouteSchema,
  declineRouteRequestSchema,
  approveRouteRequestSchema,
  deleteRouteSchema,
  assignRoleSchema,
  getRoleSchema,
  newRoleSchema,
  updateProviderSchema,
  newProviderSchema,
  newHomeBaseSchema,
  updateHomeBaseSchema,
  newDriverSchema,
  updateDriverSchema,
  updateDepartment,
  addDepartment,
  deleteDepartmentOrCountry,
  countrySchema,
  updateCountrySchema,
  newCabSchema,
  updateCabSchema,
  newAddressSchema,
  updateAddressSchema,
  fetchDepartmentTrips,
  travelTripSchema,
  dateRangeSchema,
  routeRequestUsage,
  exportToDocument,
};
