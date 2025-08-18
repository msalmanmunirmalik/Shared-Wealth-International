import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config({ path: '.env.test' });

const testPool = new Pool({
  user: process.env.DB_USER || 'm.salmanmalik',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'shared_wealth_international_test',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export { testPool };

export const mockEnv = {
  JWT_SECRET: 'test-jwt-secret-key-for-unit-tests-1234567890',
  DB_USER: 'test_user',
  DB_HOST: 'localhost',
  DB_NAME: 'test_db',
  DB_PASSWORD: 'test_password',
  DB_PORT: '5432',
  NODE_ENV: 'test'
};
