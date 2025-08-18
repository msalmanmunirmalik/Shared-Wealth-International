import app from './app.js';
import { checkDatabaseHealth, closeDatabasePool } from '../src/integrations/postgresql/config.js';

const PORT = process.env.PORT || 8080;

// Start server with proper error handling
const server = app.listen(PORT, async () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔒 Security features enabled: Helmet, Rate Limiting, CORS`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🏗️  Architecture: Layered (Routes → Controllers → Services → Database)`);
  
  // Check database health on startup
  try {
    const dbHealthy = await checkDatabaseHealth();
    if (dbHealthy) {
      console.log(`✅ Database connection healthy`);
    } else {
      console.log(`⚠️  Database connection issues detected`);
    }
  } catch (error) {
    console.error(`❌ Database health check failed:`, error);
  }
});

// Security: Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received, shutting down gracefully...`);
  
  // Close server
  server.close(async () => {
    console.log('✅ HTTP server closed');
    
    // Close database pool
    await closeDatabasePool();
    
    console.log('✅ Database pool closed');
    console.log('✅ Process terminated gracefully');
    process.exit(0);
  });
  
  // Force close after 30 seconds
  setTimeout(() => {
    console.error('❌ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 30000);
};

// Handle different shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

export default server;
