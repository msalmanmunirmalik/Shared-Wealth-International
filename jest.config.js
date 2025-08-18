export default {
  testEnvironment: 'node',
  testMatch: [
    '**/server/__tests__/basic.test.ts',
    '**/server/__tests__/simple.test.ts',
    '**/server/__tests__/services/*.unit.test.ts'
  ],
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      useESM: true,
      tsconfig: 'tsconfig.server.json'
    }]
  },
  moduleNameMapper: {
    '^\.\./\.\./src/integrations/postgresql/database\\.js$': '<rootDir>/src/integrations/postgresql/database.ts',
    '^\.\./\.\./src/integrations/postgresql/config\\.js$': '<rootDir>/src/integrations/postgresql/config.ts'
  },
  setupFiles: ['<rootDir>/server/__tests__/jest.setup.ts'],
  testTimeout: 30000,
  collectCoverage: false,
  clearMocks: true,
  restoreMocks: true,
  verbose: true,
  forceExit: true,
  detectOpenHandles: true,
  moduleFileExtensions: ['ts', 'js', 'json'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/',
    '.*\\.disabled',
    '.*\\.test\\.ts$',
    '.*/services\\.disabled/',
    '.*/integration/',
    '.*/security/'
  ],
  testEnvironmentOptions: {
    NODE_ENV: 'test'
  }
};
