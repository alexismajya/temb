const env = require('./environment');
const appEnvironment = env.NODE_ENV;
const database = {
    [appEnvironment]: {
        databaseUrl: env.DATABASE_URL,
        dialect: env.DATABASE_DIALECT || 'postgres',
        logging: false,
        use_env_variable: 'DATABASE_URL',
    },
};
module.exports = database;
//# sourceMappingURL=database.js.map