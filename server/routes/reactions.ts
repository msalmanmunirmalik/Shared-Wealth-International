import { Router } from 'express';
import { ReactionsController } from '../controllers/reactionsController.js';
import { authenticateToken } from '../middleware/auth.js';
import { generalLimiter } from '../middleware/rateLimit.js';

const router: ReturnType<typeof Router> = Router();

/**
 * @swagger
 * /api/reactions:
 *   post:
 *     summary: Add or update a reaction to a post
 *     tags: [Reactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *               - postType
 *               - reactionType
 *             properties:
 *               postId:
 *                 type: string
 *                 description: ID of the post to react to
 *               postType:
 *                 type: string
 *                 enum: [forum_topic, forum_reply, company_post, event]
 *                 description: Type of the post
 *               reactionType:
 *                 type: string
 *                 enum: [like, dislike, love, laugh, wow, sad, angry]
 *                 description: Type of reaction
 *     responses:
 *       200:
 *         description: Reaction added/updated successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 */
router.post('/', authenticateToken, generalLimiter, ReactionsController.addReaction);

/**
 * @swagger
 * /api/reactions/{postId}/{postType}:
 *   delete:
 *     summary: Remove a reaction from a post
 *     tags: [Reactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post
 *       - in: path
 *         name: postType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [forum_topic, forum_reply, company_post, event]
 *         description: Type of the post
 *     responses:
 *       200:
 *         description: Reaction removed successfully
 *       401:
 *         description: Unauthorized
 */
router.delete('/:postId/:postType', authenticateToken, generalLimiter, ReactionsController.removeReaction);

/**
 * @swagger
 * /api/reactions/{postId}/{postType}/stats:
 *   get:
 *     summary: Get reaction statistics for a post
 *     tags: [Reactions]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post
 *       - in: path
 *         name: postType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [forum_topic, forum_reply, company_post, event]
 *         description: Type of the post
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: User ID to check for user's reaction
 *     responses:
 *       200:
 *         description: Reaction statistics retrieved successfully
 */
router.get('/:postId/:postType/stats', generalLimiter, ReactionsController.getReactionStats);

/**
 * @swagger
 * /api/reactions/{postId}/{postType}/list:
 *   get:
 *     summary: Get all reactions for a post with user details
 *     tags: [Reactions]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post
 *       - in: path
 *         name: postType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [forum_topic, forum_reply, company_post, event]
 *         description: Type of the post
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of reactions to retrieve
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of reactions to skip
 *     responses:
 *       200:
 *         description: Reactions retrieved successfully
 */
router.get('/:postId/:postType/list', generalLimiter, ReactionsController.getPostReactions);

/**
 * @swagger
 * /api/reactions/user:
 *   get:
 *     summary: Get user's reaction history
 *     tags: [Reactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of reactions to retrieve
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of reactions to skip
 *     responses:
 *       200:
 *         description: User reactions retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/user', authenticateToken, generalLimiter, ReactionsController.getUserReactions);

export default router;
