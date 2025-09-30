import { Router } from 'express';
import { MonitoringController } from '../controllers/monitoringController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { adminLimiter } from '../middleware/rateLimit.js';
const router = Router();
router.use(authenticateToken);
router.use(requireAdmin);
router.get('/system-health', adminLimiter, MonitoringController.getSystemHealth);
router.get('/performance', adminLimiter, MonitoringController.getPerformanceMetrics);
router.get('/database', adminLimiter, MonitoringController.getDatabaseMetrics);
router.get('/security', adminLimiter, MonitoringController.getSecurityEvents);
router.get('/logs', adminLimiter, MonitoringController.getSystemLogs);
router.get('/disk-usage', adminLimiter, MonitoringController.getDiskUsage);
export default router;
//# sourceMappingURL=monitoring.js.map