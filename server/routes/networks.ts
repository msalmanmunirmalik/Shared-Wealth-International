import { Router } from 'express';
import { NetworkController } from '../controllers/networkController.js';
import { authenticateToken } from '../middleware/auth.js';
import { generalLimiter } from '../middleware/rateLimit.js';

const router: Router = Router();

/**
 * @swagger
 * /api/networks/user:
 *   get:
 *     summary: Get user's network companies
 *     tags: [Networks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User network retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Company'
 *       401:
 *         description: Unauthorized
 */
router.get('/user', authenticateToken, generalLimiter, NetworkController.getUserNetwork);

/**
 * @swagger
 * /api/networks/add:
 *   post:
 *     summary: Add company to user's network
 *     tags: [Networks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - company_id
 *             properties:
 *               company_id:
 *                 type: string
 *                 description: ID of the company to add
 *               connection_type:
 *                 type: string
 *                 enum: [member, partner, supplier, customer]
 *                 default: member
 *                 description: Type of connection
 *               notes:
 *                 type: string
 *                 description: Optional notes about the connection
 *     responses:
 *       200:
 *         description: Company added to network successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/add', 
  authenticateToken, 
  generalLimiter, 
  NetworkController.addToNetwork
);

/**
 * @swagger
 * /api/networks/remove:
 *   delete:
 *     summary: Remove company from user's network
 *     tags: [Networks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - company_id
 *             properties:
 *               company_id:
 *                 type: string
 *                 description: ID of the company to remove
 *     responses:
 *       200:
 *         description: Company removed from network successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.delete('/remove',
  authenticateToken,
  generalLimiter,
  NetworkController.removeFromNetwork
);

/**
 * @swagger
 * /api/networks/available:
 *   get:
 *     summary: Get companies available to add to network
 *     tags: [Networks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for company name or description
 *     responses:
 *       200:
 *         description: Available companies retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Company'
 *       401:
 *         description: Unauthorized
 */
router.get('/available', authenticateToken, generalLimiter, NetworkController.getAvailableCompanies);

export default router;
