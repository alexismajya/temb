// eslint-disable-next-line @typescript-eslint/no-var-requires
const env = require('./environment');

const appEnvironment = env.NODE_ENV;

const database = {
  [appEnvironment]: {
    databaseUrl: env.DATABASE_URL,
    dialect: env.DATABASE_DIALECT || 'postgres',
    logging: false, // env.isDevelopment, uncomment this line to see your database logs
    use_env_variable: 'DATABASE_URL',
  },
};

// DO NOT CHANGE EVER!!!
module.exports = database;
