import Joi from '@hapi/joi';
import { join } from 'path';

const isoDateTime = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/;
const dateTimeRegex = /^([0-2]\d|3[0-1])-([01]\d|1[0-2]) ([01]\d|2[0-3]):([0-5]\d)$/;
const dayTimeRegex = /^([0-2]\d|3[0-1]) ([01]\d|2[0-3]):([0-5]\d)$/;
const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;
const repeatSequenceRegex = /^(\d+) (\d+):(\d+)$/;

export const jobSchema = Joi.object().keys({
  isRecurring: Joi.boolean().default(false),
  time: Joi.when('isRecurring', {
    is: false,
    then: Joi.string()
      .regex(isoDateTime)
      .required()
      .error(() => `time must be in the ISO-8601 format`),
  }),
  cron: Joi.when('isRecurring', {
    is: true,
    then: Joi.object()
      .keys({
        isSequential: Joi.boolean().required(),
        repeatTime: Joi.when('isSequential', {
          is: false,
          then: Joi.alternatives()
            .try(
              Joi.string().regex(dayTimeRegex),
              Joi.string().regex(dateTimeRegex),
              Joi.string().regex(timeRegex),
            ).required(),
        }),
        repeatSequence: Joi.when('isSequential', {
          is: true,
          then: Joi.string()
            .regex(repeatSequenceRegex)
            .error(
              () =>
                `repeatSequence must be in the format 'days hours:minutes'`,
            ).required(),
        }),
      })
      .required(),
  }),
  timeZone: Joi.string(),
  payload: Joi.object().keys({
    queueName: Joi.string().optional(),
    callbackUrl: Joi.string().required(),
    key: Joi.string().required(),
    args: Joi.object().required(),
  }),
});
