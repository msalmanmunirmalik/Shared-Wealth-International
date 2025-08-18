import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Security: Validate required environment variables (except password for local dev)
const requiredEnvVars = ['DB_USER', 'DB_HOST', 'DB_NAME'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ CRITICAL: ${envVar} environment variable is not set!`);
    process.exit(1);
  }
}

// Security: Validate password only in production
if (process.env.NODE_ENV === 'production' && !process.env.DB_PASSWORD) {
  console.error('❌ CRITICAL: DB_PASSWORD environment variable is required in production!');
  process.exit(1);
}

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
  max: parseInt(process.env.DB_MAX_CONNECTIONS || '20'),
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT_MS || '30000'),
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT_MS || '2000'),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Security: Enhanced error handling and logging
pool.on('error', (err) => {
  console.error('❌ Database pool error:', err);
  // In production, you might want to send this to a monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Send to monitoring service (e.g., Sentry, DataDog)
    console.error('Production database error - should be monitored');
  }
  process.exit(-1);
});

pool.on('connect', (client) => {
  console.log('✅ New database client connected');
});

pool.on('acquire', (client) => {
  console.log('🔗 Database client acquired from pool');
});

pool.on('release', (client) => {
  console.log('🔓 Database client released back to pool');
});

// Security: Health check function
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database health check failed:', error);
    return false;
  }
};

// Security: Graceful shutdown
export const closeDatabasePool = async (): Promise<void> => {
  try {
    await pool.end();
    console.log('✅ Database pool closed gracefully');
  } catch (error) {
    console.error('❌ Error closing database pool:', error);
  }
};

export default pool;
