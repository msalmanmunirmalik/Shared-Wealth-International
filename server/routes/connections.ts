import { Router } from 'express';
import { ConnectionsController } from '../controllers/connectionsController.js';
import { authenticateToken } from '../middleware/auth.js';
import { generalLimiter } from '../middleware/rateLimit.js';

const router: ReturnType<typeof Router> = Router();

/**
 * @swagger
 * /api/connections/follow:
 *   post:
 *     summary: Follow a user
 *     tags: [Connections]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - targetUserId
 *             properties:
 *               targetUserId:
 *                 type: string
 *                 description: ID of the user to follow
 *               connectionType:
 *                 type: string
 *                 enum: [follow, friend, colleague, mentor]
 *                 default: follow
 *                 description: Type of connection
 *     responses:
 *       200:
 *         description: User followed successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 */
router.post('/follow', authenticateToken, generalLimiter, ConnectionsController.followUser);

/**
 * @swagger
 * /api/connections/unfollow/{targetUserId}:
 *   delete:
 *     summary: Unfollow a user
 *     tags: [Connections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: targetUserId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to unfollow
 *     responses:
 *       200:
 *         description: User unfollowed successfully
 *       401:
 *         description: Unauthorized
 */
router.delete('/unfollow/:targetUserId', authenticateToken, generalLimiter, ConnectionsController.unfollowUser);

/**
 * @swagger
 * /api/connections/{userId}/followers:
 *   get:
 *     summary: Get user's followers
 *     tags: [Connections]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of followers to retrieve
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of followers to skip
 *     responses:
 *       200:
 *         description: Followers retrieved successfully
 */
router.get('/:userId/followers', generalLimiter, ConnectionsController.getFollowers);

/**
 * @swagger
 * /api/connections/{userId}/following:
 *   get:
 *     summary: Get users that a user is following
 *     tags: [Connections]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of users to retrieve
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of users to skip
 *     responses:
 *       200:
 *         description: Following list retrieved successfully
 */
router.get('/:userId/following', generalLimiter, ConnectionsController.getFollowing);

/**
 * @swagger
 * /api/connections/{userId}/stats:
 *   get:
 *     summary: Get connection statistics for a user
 *     tags: [Connections]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *       - in: query
 *         name: currentUserId
 *         schema:
 *           type: string
 *         description: ID of the current user (for checking follow status)
 *     responses:
 *       200:
 *         description: Connection statistics retrieved successfully
 */
router.get('/:userId/stats', generalLimiter, ConnectionsController.getConnectionStats);

/**
 * @swagger
 * /api/connections/{userId1}/{userId2}/mutual:
 *   get:
 *     summary: Get mutual connections between two users
 *     tags: [Connections]
 *     parameters:
 *       - in: path
 *         name: userId1
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the first user
 *       - in: path
 *         name: userId2
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the second user
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of mutual connections to retrieve
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of mutual connections to skip
 *     responses:
 *       200:
 *         description: Mutual connections retrieved successfully
 */
router.get('/:userId1/:userId2/mutual', generalLimiter, ConnectionsController.getMutualConnections);

/**
 * @swagger
 * /api/connections/suggested:
 *   get:
 *     summary: Get suggested users to follow
 *     tags: [Connections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of suggested users to retrieve
 *     responses:
 *       200:
 *         description: Suggested users retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/suggested', authenticateToken, generalLimiter, ConnectionsController.getSuggestedUsers);

export default router;
