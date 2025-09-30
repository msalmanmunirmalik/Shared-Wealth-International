import { Router } from 'express';
import { SharingController } from '../controllers/sharingController.js';
import { authenticateToken } from '../middleware/auth.js';
import { generalLimiter } from '../middleware/rateLimit.js';

const router: ReturnType<typeof Router> = Router();

/**
 * @swagger
 * /api/sharing/share:
 *   post:
 *     summary: Share content
 *     tags: [Sharing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contentId
 *               - contentType
 *               - shareType
 *             properties:
 *               contentId:
 *                 type: string
 *                 description: ID of the content to share
 *               contentType:
 *                 type: string
 *                 enum: [forum_topic, forum_reply, company_post, event, project]
 *                 description: Type of the content
 *               shareType:
 *                 type: string
 *                 enum: [internal, linkedin, twitter, facebook, email]
 *                 description: Platform to share on
 *               platform:
 *                 type: string
 *                 description: Specific platform identifier
 *               message:
 *                 type: string
 *                 description: Custom message for the share
 *     responses:
 *       200:
 *         description: Content shared successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 */
router.post('/share', authenticateToken, generalLimiter, SharingController.shareContent);

/**
 * @swagger
 * /api/sharing/{contentId}/{contentType}/stats:
 *   get:
 *     summary: Get sharing statistics for content
 *     tags: [Sharing]
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the content
 *       - in: path
 *         name: contentType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [forum_topic, forum_reply, company_post, event, project]
 *         description: Type of the content
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: User ID to check if user has shared
 *     responses:
 *       200:
 *         description: Sharing statistics retrieved successfully
 */
router.get('/:contentId/:contentType/stats', generalLimiter, SharingController.getShareStats);

/**
 * @swagger
 * /api/sharing/{contentId}/{contentType}/shares:
 *   get:
 *     summary: Get users who shared specific content
 *     tags: [Sharing]
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the content
 *       - in: path
 *         name: contentType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [forum_topic, forum_reply, company_post, event, project]
 *         description: Type of the content
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of shares to retrieve
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of shares to skip
 *     responses:
 *       200:
 *         description: Content shares retrieved successfully
 */
router.get('/:contentId/:contentType/shares', generalLimiter, SharingController.getContentShares);

/**
 * @swagger
 * /api/sharing/user:
 *   get:
 *     summary: Get user's sharing history
 *     tags: [Sharing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of shares to retrieve
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of shares to skip
 *     responses:
 *       200:
 *         description: User shares retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/user', authenticateToken, generalLimiter, SharingController.getUserShares);

/**
 * @swagger
 * /api/sharing/{contentId}/{contentType}/link:
 *   get:
 *     summary: Generate shareable link for content
 *     tags: [Sharing]
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the content
 *       - in: path
 *         name: contentType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [forum_topic, forum_reply, company_post, event, project]
 *         description: Type of the content
 *       - in: query
 *         name: platform
 *         schema:
 *           type: string
 *           enum: [internal, linkedin, twitter, facebook]
 *           default: internal
 *         description: Platform for the shareable link
 *     responses:
 *       200:
 *         description: Shareable link generated successfully
 */
router.get('/:contentId/:contentType/link', generalLimiter, SharingController.generateShareableLink);

/**
 * @swagger
 * /api/sharing/trending:
 *   get:
 *     summary: Get trending shared content
 *     tags: [Sharing]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of trending items to retrieve
 *       - in: query
 *         name: timeframe
 *         schema:
 *           type: string
 *           enum: [24h, 7d, 30d]
 *           default: 7d
 *         description: Timeframe for trending content
 *     responses:
 *       200:
 *         description: Trending content retrieved successfully
 */
router.get('/trending', generalLimiter, SharingController.getTrendingSharedContent);

export default router;
