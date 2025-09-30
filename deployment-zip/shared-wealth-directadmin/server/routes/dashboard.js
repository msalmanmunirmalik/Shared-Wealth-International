import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { generalLimiter, adminLimiter } from '../middleware/rateLimit.js';
const router = Router();
router.get('/stats', authenticateToken, generalLimiter, DashboardController.getDashboardStats);
router.get('/activities', authenticateToken, generalLimiter, DashboardController.getRecentActivities);
router.get('/projects', authenticateToken, generalLimiter, DashboardController.getUserProjects);
router.get('/meetings', authenticateToken, generalLimiter, DashboardController.getUserMeetings);
router.get('/platform-stats', authenticateToken, requireAdmin, adminLimiter, DashboardController.getPlatformStats);
export default router;
//# sourceMappingURL=dashboard.js.map