import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { generalLimiter, adminLimiter } from '../middleware/rateLimit.js';

const router: ReturnType<typeof Router> = Router();

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get comprehensive dashboard statistics for authenticated user
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalCompanies:
 *                       type: number
 *                       description: Number of companies associated with user
 *                     networkPartners:
 *                       type: number
 *                       description: Total approved companies in network
 *                     growthRate:
 *                       type: number
 *                       description: Growth rate percentage
 *                     activeProjects:
 *                       type: number
 *                       description: Number of active projects
 *                     pendingApplications:
 *                       type: number
 *                       description: Number of pending applications
 *                     approvedCompanies:
 *                       type: number
 *                       description: Number of approved companies
 *                     totalUsers:
 *                       type: number
 *                       description: Total active users
 *                     totalEvents:
 *                       type: number
 *                       description: Total upcoming events
 *                     totalForumPosts:
 *                       type: number
 *                       description: Total forum posts
 *                     totalMessages:
 *                       type: number
 *                       description: Total messages for user
 *                     recentActivities:
 *                       type: number
 *                       description: Recent activities count
 *                     collaborationMeetings:
 *                       type: number
 *                       description: Collaboration meetings count
 *       401:
 *         description: Unauthorized
 */
router.get('/stats', authenticateToken, generalLimiter, DashboardController.getDashboardStats);

/**
 * @swagger
 * /api/dashboard/activities:
 *   get:
 *     summary: Get user's recent activities
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of activities to retrieve
 *     responses:
 *       200:
 *         description: Recent activities retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/activities', authenticateToken, generalLimiter, DashboardController.getRecentActivities);

/**
 * @swagger
 * /api/dashboard/projects:
 *   get:
 *     summary: Get user's projects
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User projects retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/projects', authenticateToken, generalLimiter, DashboardController.getUserProjects);

/**
 * @swagger
 * /api/dashboard/meetings:
 *   get:
 *     summary: Get user's collaboration meetings
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Collaboration meetings retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/meetings', authenticateToken, generalLimiter, DashboardController.getUserMeetings);

/**
 * @swagger
 * /api/dashboard/platform-stats:
 *   get:
 *     summary: Get platform-wide statistics (admin only)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Platform statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get('/platform-stats', authenticateToken, requireAdmin, adminLimiter, DashboardController.getPlatformStats);

export default router;
