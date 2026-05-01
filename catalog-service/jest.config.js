module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'controller/**/*.js',
    'routes/**/*.js',
    'db/**/*.js',
    '!**/*.test.js',
  ],
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testMatch: ['**/__tests__/**/*.test.js'],
  verbose: true,
};
