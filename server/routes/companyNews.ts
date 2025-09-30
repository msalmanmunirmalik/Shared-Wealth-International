import { Router, type Router as ExpressRouter } from 'express';
import { CompanyNewsController } from '../controllers/companyNewsController.js';
import { authenticateToken } from '../middleware/auth.js';
import { generalLimiter } from '../middleware/rateLimit.js';

const router: ExpressRouter = Router();

/**
 * @swagger
 * /api/news:
 *   get:
 *     summary: Get all company news (platform-wide feed)
 *     tags: [Company News]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of news items to retrieve
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of news items to skip
 *     responses:
 *       200:
 *         description: Company news retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/', generalLimiter, CompanyNewsController.getAllCompanyNews);

/**
 * @swagger
 * /api/companies/{companyId}/news:
 *   get:
 *     summary: Get company news for a specific company
 *     tags: [Company News]
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Company news retrieved successfully
 *       400:
 *         description: Invalid company ID
 *       500:
 *         description: Internal server error
 */
router.get('/companies/:companyId/news', generalLimiter, CompanyNewsController.getCompanyNews);

/**
 * @swagger
 * /api/companies/{companyId}/news:
 *   post:
 *     summary: Create a new company news post
 *     tags: [Company News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 description: Post title
 *               content:
 *                 type: string
 *                 description: Post content
 *               post_type:
 *                 type: string
 *                 enum: [news, update, announcement, collaboration]
 *                 default: news
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Post tags
 *               media_urls:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Media URLs
 *     responses:
 *       201:
 *         description: News & Update created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/companies/:companyId/news', authenticateToken, generalLimiter, CompanyNewsController.createCompanyPost);

/**
 * @swagger
 * /api/companies/{companyId}/news/{postId}:
 *   put:
 *     summary: Update a company news post
 *     tags: [Company News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Post title
 *               content:
 *                 type: string
 *                 description: Post content
 *               post_type:
 *                 type: string
 *                 enum: [news, update, announcement, collaboration]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Post tags
 *               media_urls:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Media URLs
 *     responses:
 *       200:
 *         description: News & Update updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.put('/companies/:companyId/news/:postId', authenticateToken, generalLimiter, CompanyNewsController.updateCompanyPost);

/**
 * @swagger
 * /api/companies/{companyId}/news/{postId}:
 *   delete:
 *     summary: Delete a company news post
 *     tags: [Company News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: News & Update deleted successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete('/companies/:companyId/news/:postId', authenticateToken, generalLimiter, CompanyNewsController.deleteCompanyPost);

export default router;
