import { Router, type Router as ExpressRouter } from 'express';
import { UnifiedDashboardController } from '../controllers/unifiedDashboardController.js';
import { authenticateToken } from '../middleware/auth.js';
import { generalLimiter } from '../middleware/rateLimit.js';

const router: ExpressRouter = Router();

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get unified dashboard data
 *     tags: [Unified Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sections
 *         schema:
 *           type: string
 *           default: all
 *         description: Comma-separated list of sections to include (user,companies,analytics,notifications,activity,widgets,content,social)
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [7d, 30d, 90d]
 *           default: 30d
 *         description: Time period for analytics
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', authenticateToken, generalLimiter, UnifiedDashboardController.getDashboard);

/**
 * @swagger
 * /api/dashboard/user/{userId}:
 *   get:
 *     summary: Get user-specific dashboard data
 *     tags: [Unified Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [7d, 30d, 90d]
 *           default: 30d
 *         description: Time period for analytics
 *     responses:
 *       200:
 *         description: User dashboard data retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get('/user/:userId', authenticateToken, generalLimiter, UnifiedDashboardController.getUserDashboard);

/**
 * @swagger
 * /api/dashboard/company/{companyId}:
 *   get:
 *     summary: Get company-specific dashboard data
 *     tags: [Unified Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [7d, 30d, 90d]
 *           default: 30d
 *         description: Time period for analytics
 *     responses:
 *       200:
 *         description: Company dashboard data retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get('/company/:companyId', authenticateToken, generalLimiter, UnifiedDashboardController.getCompanyDashboard);

/**
 * @swagger
 * /api/dashboard/admin:
 *   get:
 *     summary: Get admin dashboard data
 *     tags: [Unified Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [7d, 30d, 90d]
 *           default: 30d
 *         description: Time period for analytics
 *     responses:
 *       200:
 *         description: Admin dashboard data retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get('/admin', authenticateToken, generalLimiter, UnifiedDashboardController.getAdminDashboard);

/**
 * @swagger
 * /api/dashboard/analytics:
 *   get:
 *     summary: Get dashboard analytics
 *     tags: [Unified Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [overview, user, company, platform]
 *           default: overview
 *         description: Type of analytics to retrieve
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [7d, 30d, 90d]
 *           default: 30d
 *         description: Time period for analytics
 *       - in: query
 *         name: entityId
 *         schema:
 *           type: string
 *         description: Entity ID for specific analytics (company ID, etc.)
 *       - in: query
 *         name: entityType
 *         schema:
 *           type: string
 *         description: Entity type for specific analytics
 *     responses:
 *       200:
 *         description: Analytics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/analytics', authenticateToken, generalLimiter, UnifiedDashboardController.getDashboardAnalytics);

/**
 * @swagger
 * /api/dashboard/widgets:
 *   get:
 *     summary: Get dashboard widgets configuration
 *     tags: [Unified Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dashboardType
 *         schema:
 *           type: string
 *           enum: [user, company, admin]
 *           default: user
 *         description: Type of dashboard
 *     responses:
 *       200:
 *         description: Widgets configuration retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/widgets', authenticateToken, generalLimiter, UnifiedDashboardController.getDashboardWidgets);

/**
 * @swagger
 * /api/dashboard/widgets:
 *   put:
 *     summary: Update dashboard widgets configuration
 *     tags: [Unified Dashboard]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - widgets
 *             properties:
 *               widgets:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     type:
 *                       type: string
 *                     title:
 *                       type: string
 *                     position:
 *                       type: object
 *                       properties:
 *                         x:
 *                           type: number
 *                         y:
 *                           type: number
 *                         w:
 *                           type: number
 *                         h:
 *                           type: number
 *                     config:
 *                       type: object
 *                     enabled:
 *                       type: boolean
 *     responses:
 *       200:
 *         description: Widgets configuration updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.put('/widgets', authenticateToken, generalLimiter, UnifiedDashboardController.updateDashboardWidgets);

/**
 * @swagger
 * /api/dashboard/notifications:
 *   get:
 *     summary: Get dashboard notifications
 *     tags: [Unified Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of notifications to retrieve
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of notifications to skip
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [all, system, social, content, company]
 *           default: all
 *         description: Filter by notification type
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/notifications', authenticateToken, generalLimiter, UnifiedDashboardController.getDashboardNotifications);

/**
 * @swagger
 * /api/dashboard/notifications/{notificationId}/read:
 *   patch:
 *     summary: Mark notification as read
 *     tags: [Unified Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.patch('/notifications/:notificationId/read', authenticateToken, generalLimiter, UnifiedDashboardController.markNotificationRead);

/**
 * @swagger
 * /api/dashboard/activity:
 *   get:
 *     summary: Get dashboard activity feed
 *     tags: [Unified Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of activity items to retrieve
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of activity items to skip
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [all, content, social, company, system]
 *           default: all
 *         description: Filter by activity type
 *     responses:
 *       200:
 *         description: Activity feed retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/activity', authenticateToken, generalLimiter, UnifiedDashboardController.getActivityFeed);

export default router;
