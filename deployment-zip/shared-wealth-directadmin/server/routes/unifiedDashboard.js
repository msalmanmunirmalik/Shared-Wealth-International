import { Router } from 'express';
import { UnifiedDashboardController } from '../controllers/unifiedDashboardController.js';
import { authenticateToken } from '../middleware/auth.js';
import { generalLimiter } from '../middleware/rateLimit.js';
const router = Router();
router.get('/', authenticateToken, generalLimiter, UnifiedDashboardController.getDashboard);
router.get('/user/:userId', authenticateToken, generalLimiter, UnifiedDashboardController.getUserDashboard);
router.get('/company/:companyId', authenticateToken, generalLimiter, UnifiedDashboardController.getCompanyDashboard);
router.get('/admin', authenticateToken, generalLimiter, UnifiedDashboardController.getAdminDashboard);
router.get('/analytics', authenticateToken, generalLimiter, UnifiedDashboardController.getDashboardAnalytics);
router.get('/widgets', authenticateToken, generalLimiter, UnifiedDashboardController.getDashboardWidgets);
router.put('/widgets', authenticateToken, generalLimiter, UnifiedDashboardController.updateDashboardWidgets);
router.get('/notifications', authenticateToken, generalLimiter, UnifiedDashboardController.getDashboardNotifications);
router.patch('/notifications/:notificationId/read', authenticateToken, generalLimiter, UnifiedDashboardController.markNotificationRead);
router.get('/activity', authenticateToken, generalLimiter, UnifiedDashboardController.getActivityFeed);
export default router;
//# sourceMappingURL=unifiedDashboard.js.map