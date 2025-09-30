import { Router } from 'express';
import { MonitoringController } from '../controllers/monitoringController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { adminLimiter } from '../middleware/rateLimit.js';

const router: ReturnType<typeof Router> = Router();

// All monitoring routes require authentication and admin privileges
router.use(authenticateToken);
router.use(requireAdmin);

/**
 * @route   GET /api/admin/monitoring/system-health
 * @desc    Get comprehensive system health status
 * @access  Private (Admin)
 */
router.get('/system-health', 
  adminLimiter,
  MonitoringController.getSystemHealth
);

/**
 * @route   GET /api/admin/monitoring/performance
 * @desc    Get API performance metrics
 * @access  Private (Admin)
 */
router.get('/performance', 
  adminLimiter,
  MonitoringController.getPerformanceMetrics
);

/**
 * @route   GET /api/admin/monitoring/database
 * @desc    Get database performance metrics
 * @access  Private (Admin)
 */
router.get('/database', 
  adminLimiter,
  MonitoringController.getDatabaseMetrics
);

/**
 * @route   GET /api/admin/monitoring/security
 * @desc    Get security events and monitoring data
 * @access  Private (Admin)
 */
router.get('/security', 
  adminLimiter,
  MonitoringController.getSecurityEvents
);

/**
 * @route   GET /api/admin/monitoring/logs
 * @desc    Get system logs
 * @access  Private (Admin)
 */
router.get('/logs', 
  adminLimiter,
  MonitoringController.getSystemLogs
);

/**
 * @route   GET /api/admin/monitoring/disk-usage
 * @desc    Get disk usage information
 * @access  Private (Admin)
 */
router.get('/disk-usage', 
  adminLimiter,
  MonitoringController.getDiskUsage
);

export default router;
