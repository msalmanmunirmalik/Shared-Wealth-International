import app from './app.js';
import { createServer } from 'http';
import { checkDatabaseHealth, closeDatabasePool } from '../src/integrations/postgresql/config.js';
import { webSocketService } from './services/webSocketService.js';
const PORT = process.env.PORT || 8080;
const httpServer = createServer(app);
webSocketService.initialize(httpServer);
const server = httpServer.listen(PORT, async () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🔒 Security features enabled: Helmet, Rate Limiting, CORS`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🏗️  Architecture: Layered (Routes → Controllers → Services → Database)`);
    console.log(`🔌 WebSocket service initialized for real-time features`);
    try {
        const dbHealthy = await checkDatabaseHealth();
        if (dbHealthy) {
            console.log(`✅ Database connection healthy`);
        }
        else {
            console.log(`⚠️  Database connection issues detected`);
        }
    }
    catch (error) {
        console.error(`❌ Database health check failed:`, error);
    }
    if (process.env.NODE_ENV === 'production') {
        try {
            console.log(`🔧 Running database setup on production startup...`);
            const { spawn } = await import('child_process');
            const setupProcess = spawn('node', ['scripts/startup-db-setup.js'], {
                stdio: 'inherit',
                cwd: process.cwd()
            });
            setupProcess.on('close', (code) => {
                if (code === 0) {
                    console.log(`✅ Database setup completed successfully`);
                }
                else {
                    console.log(`⚠️  Database setup completed with warnings (code: ${code})`);
                }
            });
        }
        catch (error) {
            console.error(`❌ Database setup failed:`, error);
        }
    }
});
const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} received, shutting down gracefully...`);
    server.close(async () => {
        console.log('✅ HTTP server closed');
        webSocketService.close();
        console.log('✅ WebSocket service closed');
        await closeDatabasePool();
        console.log('✅ Database pool closed');
        console.log('✅ Process terminated gracefully');
        process.exit(0);
    });
    setTimeout(() => {
        console.error('❌ Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 30000);
};
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    gracefulShutdown('uncaughtException');
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('unhandledRejection');
});
export default server;
//# sourceMappingURL=server.js.map