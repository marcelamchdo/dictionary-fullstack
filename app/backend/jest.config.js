export default {
  testEnvironment: 'node',
  testTimeout: 30000,
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: ['**/*.js'], 
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov']
};
