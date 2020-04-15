require('../load-env');

const isDevelopment = (process.env.NODE_ENV === 'development')
  || (process.env.NODE_ENV === 'dev');

const decodeB64 = (value) => {
  let decoded = '';
  try {
    decoded = Buffer.from(value, 'base64').toString('ascii');
  } catch {
    // do nothing really
  }
  return decoded;
};

const environment = {
  ...process.env,
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'production',
  REDIS_URL: process.env.REDIS_URL || 'no-redis',
  DATABASE_URL: process.env.DATABASE_URL,
  SCHEDULER_CLIENT_ID: process.env.SCHEDULER_CLIENT_ID,
  SCHEDULER_CLIENT_SECRET: process.env.SCHEDULER_CLIENT_SECRET,
  SCHEDULER_URL: process.env.SCHEDULER_URL,
  SCHEDULER_DEFAULT_CALLBACK_URL: process.env.SCHEDULER_DEFAULT_CALLBACK_URL,
  TRIP_AUTO_APPROVE_TIMEOUT: isDevelopment ? 35 : 30,
  TAKEOFF_TIMEOUT: isDevelopment ? 30 : 15,
  TRIP_COMPLETION_TIMEOUT: isDevelopment ? -30 : 90,
  TEMBEA_EMAIL_ADDRESS: process.env.TEMBEA_MAIL_ADDRESS,
  TEMBEA_PRIVATE_KEY: decodeB64(process.env.TEMBEA_PRIVATE_KEY),
  TEMBEA_PUBLIC_KEY: decodeB64(process.env.TEMBEA_PUBLIC_KEY),
  JWT_ANDELA_KEY: decodeB64(process.env.JWT_ANDELA_KEY),
  TEMBEA_BACKEND_URL: process.env.TEMBEA_BACKEND_URL,
  TEMBEA_FRONTEND_URL: process.env.TEMBEA_FRONTEND_URL,
  VAPID_PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY,
  BUGSNAG_API_KEY: process.env.BUGSNAG_API_KEY,
  isDevelopment,
};

module.exports = environment;
