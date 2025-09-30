import { Router, type Router as ExpressRouter } from 'express';
import { UnifiedSocialController } from '../controllers/unifiedSocialController.js';
import { authenticateToken } from '../middleware/auth.js';
import { generalLimiter } from '../middleware/rateLimit.js';

const router: ExpressRouter = Router();

/**
 * @swagger
 * /api/social/reactions/{contentId}:
 *   post:
 *     summary: Add reaction to content
 *     tags: [Unified Social]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Content ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reaction_type
 *               - content_type
 *             properties:
 *               reaction_type:
 *                 type: string
 *                 enum: [like, love, laugh, wow, sad, angry, celebrate]
 *                 description: Type of reaction
 *               content_type:
 *                 type: string
 *                 description: Type of content being reacted to
 *     responses:
 *       200:
 *         description: Reaction added successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/reactions/:contentId', authenticateToken, generalLimiter, UnifiedSocialController.addReaction);

/**
 * @swagger
 * /api/social/reactions/{contentId}:
 *   delete:
 *     summary: Remove reaction from content
 *     tags: [Unified Social]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Content ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reaction_type
 *               - content_type
 *             properties:
 *               reaction_type:
 *                 type: string
 *                 enum: [like, love, laugh, wow, sad, angry, celebrate]
 *                 description: Type of reaction
 *               content_type:
 *                 type: string
 *                 description: Type of content being reacted to
 *     responses:
 *       200:
 *         description: Reaction removed successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete('/reactions/:contentId', authenticateToken, generalLimiter, UnifiedSocialController.removeReaction);

/**
 * @swagger
 * /api/social/reactions/{contentId}:
 *   get:
 *     summary: Get reactions for content
 *     tags: [Unified Social]
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Content ID
 *       - in: query
 *         name: content_type
 *         required: true
 *         schema:
 *           type: string
 *         description: Type of content
 *     responses:
 *       200:
 *         description: Reactions retrieved successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */
router.get('/reactions/:contentId', generalLimiter, UnifiedSocialController.getReactions);

/**
 * @swagger
 * /api/social/follow/{targetUserId}:
 *   post:
 *     summary: Follow a user
 *     tags: [Unified Social]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: targetUserId
 *         required: true
 *         schema:
 *           type: string
 *         description: Target user ID to follow
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               connection_type:
 *                 type: string
 *                 enum: [follow, friend, colleague, mentor]
 *                 default: follow
 *                 description: Type of connection
 *     responses:
 *       200:
 *         description: User followed successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/follow/:targetUserId', authenticateToken, generalLimiter, UnifiedSocialController.followUser);

/**
 * @swagger
 * /api/social/follow/{targetUserId}:
 *   delete:
 *     summary: Unfollow a user
 *     tags: [Unified Social]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: targetUserId
 *         required: true
 *         schema:
 *           type: string
 *         description: Target user ID to unfollow
 *     responses:
 *       200:
 *         description: User unfollowed successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete('/follow/:targetUserId', authenticateToken, generalLimiter, UnifiedSocialController.unfollowUser);

/**
 * @swagger
 * /api/social/connections/{userId}:
 *   get:
 *     summary: Get user connections
 *     tags: [Unified Social]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [all, followers, following]
 *           default: all
 *         description: Type of connections to retrieve
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of connections to retrieve
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of connections to skip
 *     responses:
 *       200:
 *         description: Connections retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/connections/:userId', generalLimiter, UnifiedSocialController.getConnections);

/**
 * @swagger
 * /api/social/connections/{userId}/stats:
 *   get:
 *     summary: Get connection statistics
 *     tags: [Unified Social]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Connection stats retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/connections/:userId/stats', generalLimiter, UnifiedSocialController.getConnectionStats);

/**
 * @swagger
 * /api/social/share/{contentId}:
 *   post:
 *     summary: Share content
 *     tags: [Unified Social]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Content ID to share
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - share_type
 *               - platform
 *             properties:
 *               share_type:
 *                 type: string
 *                 enum: [internal, linkedin, twitter, facebook, email]
 *                 description: Type of share
 *               platform:
 *                 type: string
 *                 description: Platform to share on
 *               message:
 *                 type: string
 *                 description: Optional message with share
 *     responses:
 *       200:
 *         description: Content shared successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/share/:contentId', authenticateToken, generalLimiter, UnifiedSocialController.shareContent);

/**
 * @swagger
 * /api/social/shares/{userId}:
 *   get:
 *     summary: Get user's shared content
 *     tags: [Unified Social]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: query
 *         name: platform
 *         schema:
 *           type: string
 *         description: Filter by platform
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of shares to retrieve
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of shares to skip
 *     responses:
 *       200:
 *         description: Shared content retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/shares/:userId', generalLimiter, UnifiedSocialController.getSharedContent);

/**
 * @swagger
 * /api/social/bookmark/{contentId}:
 *   post:
 *     summary: Bookmark content
 *     tags: [Unified Social]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Content ID to bookmark
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content_type
 *             properties:
 *               content_type:
 *                 type: string
 *                 description: Type of content being bookmarked
 *     responses:
 *       200:
 *         description: Content bookmarked successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/bookmark/:contentId', authenticateToken, generalLimiter, UnifiedSocialController.bookmarkContent);

/**
 * @swagger
 * /api/social/bookmark/{contentId}:
 *   delete:
 *     summary: Remove bookmark
 *     tags: [Unified Social]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Content ID to remove bookmark from
 *     responses:
 *       200:
 *         description: Bookmark removed successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete('/bookmark/:contentId', authenticateToken, generalLimiter, UnifiedSocialController.removeBookmark);

/**
 * @swagger
 * /api/social/bookmarks/{userId}:
 *   get:
 *     summary: Get user's bookmarks
 *     tags: [Unified Social]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: query
 *         name: content_type
 *         schema:
 *           type: string
 *         description: Filter by content type
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of bookmarks to retrieve
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of bookmarks to skip
 *     responses:
 *       200:
 *         description: Bookmarks retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/bookmarks/:userId', generalLimiter, UnifiedSocialController.getBookmarks);

/**
 * @swagger
 * /api/social/analytics/{userId}:
 *   get:
 *     summary: Get social analytics
 *     tags: [Unified Social]
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
 *         description: Social analytics retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/analytics/:userId', generalLimiter, UnifiedSocialController.getSocialAnalytics);

/**
 * @swagger
 * /api/social/feed:
 *   get:
 *     summary: Get personalized social feed
 *     tags: [Unified Social]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of feed items to retrieve
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of feed items to skip
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [all, news, update, announcement, collaboration]
 *           default: all
 *         description: Filter by content type
 *     responses:
 *       200:
 *         description: Social feed retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/feed', authenticateToken, generalLimiter, UnifiedSocialController.getSocialFeed);

export default router;
