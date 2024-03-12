// eslint-disable-next-line no-undef, @typescript-eslint/no-var-requires
const { name } = require('./package.json');

// eslint-disable-next-line no-undef
module.exports = {
  displayName: name.replace('@dimkl', ''),
  globals: {
    PACKAGE_NAME: '@dimkl/clerk-koa',
    PACKAGE_VERSION: '0.0.0-test',
  },
  roots: ['<rootDir>/src'],
  testMatch: ['**/?(*.)+(test).+(ts|js)'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
  collectCoverage: true,
  testPathIgnorePatterns: ['/node_modules/', '/coverage', '/dist/'],
};
