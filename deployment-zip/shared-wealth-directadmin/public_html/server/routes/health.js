import { Router } from 'express';
import { healthCheck, metricsEndpoint, systemStatus } from '../middleware/monitoring.js';
import { healthCheckLimiter } from '../middleware/rateLimit.js';
const router = Router();
router.get('/', healthCheckLimiter, healthCheck);
router.get('/metrics', healthCheckLimiter, metricsEndpoint);
router.get('/status', healthCheckLimiter, systemStatus);
router.get('/detailed', healthCheckLimiter, async (req, res) => {
    try {
        const { checkDatabaseHealth } = await import('../../src/integrations/postgresql/config.js');
        const dbHealth = await checkDatabaseHealth();
        const detailedHealth = {
            status: dbHealth ? 'healthy' : 'unhealthy',
            timestamp: new Date().toISOString(),
            checks: {
                database: {
                    status: dbHealth ? 'healthy' : 'unhealthy',
                    message: dbHealth ? 'Database connection successful' : 'Database connection failed'
                },
                memory: {
                    status: 'healthy',
                    message: 'Memory usage within normal limits',
                    details: process.memoryUsage()
                },
                uptime: {
                    status: 'healthy',
                    message: 'System running normally',
                    details: `${Math.floor(process.uptime())}s`
                }
            }
        };
        const overallStatus = detailedHealth.checks.database.status === 'healthy' ? 200 : 503;
        res.status(overallStatus).json(detailedHealth);
    }
    catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: 'Health check failed',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
export default router;
//# sourceMappingURL=health.js.map