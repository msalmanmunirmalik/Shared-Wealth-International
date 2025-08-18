// Test Environment Configuration
export const testConfig = {
  // Test Environment
  NODE_ENV: 'test',
  PORT: 3001,

  // Test Database Configuration
  TEST_DB_USER: 'm.salmanmalik',
  TEST_DB_HOST: 'localhost',
  TEST_DB_NAME: 'shared_wealth_international_test',
  TEST_DB_PASSWORD: '',
  TEST_DB_PORT: 5432,

  // Test JWT Configuration
  JWT_SECRET: 'test-jwt-secret-key-for-testing-only-must-be-very-long-and-secure-for-testing-purposes',

  // Test Rate Limiting (More permissive for testing)
  RATE_LIMIT_WINDOW_MS: 60000,
  RATE_LIMIT_MAX_REQUESTS: 1000,
  AUTH_RATE_LIMIT_MAX_REQUESTS: 100,
  ADMIN_RATE_LIMIT_MAX_REQUESTS: 500,
  UPLOAD_RATE_LIMIT_MAX_REQUESTS: 100,
  HEALTH_CHECK_RATE_LIMIT_MAX_REQUESTS: 10000,

  // Test Request Limits
  MAX_REQUEST_SIZE: '10mb',

  // Test Database Connection Limits
  DB_MAX_CONNECTIONS: 5,
  DB_IDLE_TIMEOUT_MS: 30000,
  DB_CONNECTION_TIMEOUT_MS: 2000,

  // Test CORS
  ALLOWED_ORIGINS: 'http://localhost:3001,http://localhost:3002'
};

// Mock environment variables for testing
export const mockEnvVars = () => {
  process.env.NODE_ENV = testConfig.NODE_ENV;
  process.env.PORT = testConfig.PORT.toString();
  process.env.JWT_SECRET = testConfig.JWT_SECRET;
  process.env.TEST_DB_USER = testConfig.TEST_DB_USER;
  process.env.TEST_DB_HOST = testConfig.TEST_DB_HOST;
  process.env.TEST_DB_NAME = testConfig.TEST_DB_NAME;
  process.env.TEST_DB_PASSWORD = testConfig.TEST_DB_PASSWORD;
  process.env.TEST_DB_PORT = testConfig.TEST_DB_PORT.toString();
  process.env.RATE_LIMIT_WINDOW_MS = testConfig.RATE_LIMIT_WINDOW_MS.toString();
  process.env.RATE_LIMIT_MAX_REQUESTS = testConfig.RATE_LIMIT_MAX_REQUESTS.toString();
  process.env.AUTH_RATE_LIMIT_MAX_REQUESTS = testConfig.AUTH_RATE_LIMIT_MAX_REQUESTS.toString();
  process.env.ADMIN_RATE_LIMIT_MAX_REQUESTS = testConfig.ADMIN_RATE_LIMIT_MAX_REQUESTS.toString();
  process.env.UPLOAD_RATE_LIMIT_MAX_REQUESTS = testConfig.UPLOAD_RATE_LIMIT_MAX_REQUESTS.toString();
  process.env.HEALTH_CHECK_RATE_LIMIT_MAX_REQUESTS = testConfig.HEALTH_CHECK_RATE_LIMIT_MAX_REQUESTS.toString();
  process.env.MAX_REQUEST_SIZE = testConfig.MAX_REQUEST_SIZE;
  process.env.DB_MAX_CONNECTIONS = testConfig.DB_MAX_CONNECTIONS.toString();
  process.env.DB_IDLE_TIMEOUT_MS = testConfig.DB_IDLE_TIMEOUT_MS.toString();
  process.env.DB_CONNECTION_TIMEOUT_MS = testConfig.DB_CONNECTION_TIMEOUT_MS.toString();
  process.env.ALLOWED_ORIGINS = testConfig.ALLOWED_ORIGINS;
};
