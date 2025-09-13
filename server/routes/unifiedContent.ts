import { Router, type Router as ExpressRouter } from 'express';
import { UnifiedContentController } from '../controllers/unifiedContentController.js';
import { authenticateToken } from '../middleware/auth.js';
import { generalLimiter } from '../middleware/rateLimit.js';

const router: ExpressRouter = Router();

/**
 * @swagger
 * /api/content:
 *   get:
 *     summary: Get all content with filtering and pagination
 *     tags: [Unified Content]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [news, update, announcement, collaboration, post, article, event]
 *         description: Filter by content type
 *       - in: query
 *         name: author_id
 *         schema:
 *           type: string
 *         description: Filter by author ID
 *       - in: query
 *         name: company_id
 *         schema:
 *           type: string
 *         description: Filter by company ID
 *       - in: query
 *         name: is_published
 *         schema:
 *           type: boolean
 *         description: Filter by publish status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title and content
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of items to retrieve
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of items to skip
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           default: published_at
 *         description: Field to sort by
 *       - in: query
 *         name: sort_order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Content retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/', generalLimiter, UnifiedContentController.getAllContent);

/**
 * @swagger
 * /api/content/{id}:
 *   get:
 *     summary: Get content by ID
 *     tags: [Unified Content]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Content ID
 *     responses:
 *       200:
 *         description: Content retrieved successfully
 *       404:
 *         description: Content not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', generalLimiter, UnifiedContentController.getContentById);

/**
 * @swagger
 * /api/content:
 *   post:
 *     summary: Create new content
 *     tags: [Unified Content]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - type
 *             properties:
 *               title:
 *                 type: string
 *                 description: Content title
 *               content:
 *                 type: string
 *                 description: Content body
 *               type:
 *                 type: string
 *                 enum: [news, update, announcement, collaboration, post, article, event]
 *                 description: Content type
 *               company_id:
 *                 type: string
 *                 description: Company ID (optional)
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Content tags
 *               media_urls:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Media URLs
 *               metadata:
 *                 type: object
 *                 description: Additional metadata
 *               is_published:
 *                 type: boolean
 *                 default: true
 *                 description: Publish status
 *     responses:
 *       201:
 *         description: Content created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticateToken, generalLimiter, UnifiedContentController.createContent);

/**
 * @swagger
 * /api/content/{id}:
 *   put:
 *     summary: Update content
 *     tags: [Unified Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *             properties:
 *               title:
 *                 type: string
 *                 description: Content title
 *               content:
 *                 type: string
 *                 description: Content body
 *               type:
 *                 type: string
 *                 enum: [news, update, announcement, collaboration, post, article, event]
 *                 description: Content type
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Content tags
 *               media_urls:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Media URLs
 *               metadata:
 *                 type: object
 *                 description: Additional metadata
 *               is_published:
 *                 type: boolean
 *                 description: Publish status
 *     responses:
 *       200:
 *         description: Content updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Content not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authenticateToken, generalLimiter, UnifiedContentController.updateContent);

/**
 * @swagger
 * /api/content/{id}:
 *   delete:
 *     summary: Delete content
 *     tags: [Unified Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Content ID
 *     responses:
 *       200:
 *         description: Content deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Content not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticateToken, generalLimiter, UnifiedContentController.deleteContent);

/**
 * @swagger
 * /api/content/company/{companyId}:
 *   get:
 *     summary: Get content by company
 *     tags: [Unified Content]
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [news, update, announcement, collaboration, post, article, event]
 *         description: Filter by content type
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of items to retrieve
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of items to skip
 *     responses:
 *       200:
 *         description: Company content retrieved successfully
 *       400:
 *         description: Invalid company ID
 *       500:
 *         description: Internal server error
 */
router.get('/company/:companyId', generalLimiter, UnifiedContentController.getContentByCompany);

/**
 * @swagger
 * /api/content/user/{userId}:
 *   get:
 *     summary: Get content by user
 *     tags: [Unified Content]
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
 *           enum: [news, update, announcement, collaboration, post, article, event]
 *         description: Filter by content type
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of items to retrieve
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of items to skip
 *     responses:
 *       200:
 *         description: User content retrieved successfully
 *       400:
 *         description: Invalid user ID
 *       500:
 *         description: Internal server error
 */
router.get('/user/:userId', generalLimiter, UnifiedContentController.getContentByUser);

/**
 * @swagger
 * /api/content/{id}/publish:
 *   patch:
 *     summary: Toggle publish status
 *     tags: [Unified Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               - is_published
 *             properties:
 *               is_published:
 *                 type: boolean
 *                 description: Publish status
 *     responses:
 *       200:
 *         description: Publish status updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Content not found
 *       500:
 *         description: Internal server error
 */
router.patch('/:id/publish', authenticateToken, generalLimiter, UnifiedContentController.togglePublishStatus);

export default router;
