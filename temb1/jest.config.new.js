module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.(ts|js)',
    '!<rootDir>/src/index.(ts|js)',
    '!**/node_modules/**',
  ],
  rootDir: './',
  testMatch: [
    '<rootDir>/src/modules/shared/**/?(*.)(spec|test).(ts|js)',
    '<rootDir>/src/modules/locations/**/?(*.)(spec|test).(ts|js)',
    '<rootDir>/src/modules/addresses/**/?(*.)(spec|test).(ts|js)'
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/src/database/*.(ts|js)',
    '<rootDir>/src/middlewares/index.(ts|js)'
  ],
  testEnvironment: 'node',
  moduleFileExtensions: [
    'ts',
    'js',
    'json'
  ],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  }
};
