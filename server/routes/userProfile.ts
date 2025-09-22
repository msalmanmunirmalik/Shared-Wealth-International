import express from 'express';
import { UserProfileController } from '../controllers/userProfileController.js';
import { authenticateToken } from '../middleware/auth.js';
import { generalLimiter } from '../middleware/rateLimit.js';

const router: express.Router = express.Router();

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     bio:
 *                       type: string
 *                     avatar_url:
 *                       type: string
 *                     role:
 *                       type: string
 *                     created_at:
 *                       type: string
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/profile',
  authenticateToken,
  generalLimiter,
  UserProfileController.getUserProfile
);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               bio:
 *                 type: string
 *               company_name:
 *                 type: string
 *               position:
 *                 type: string
 *               phone:
 *                 type: string
 *               location:
 *                 type: string
 *               website:
 *                 type: string
 *               linkedin:
 *                 type: string
 *               twitter:
 *                 type: string
 *               role:
 *                 type: string
 *               avatar_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put('/profile',
  authenticateToken,
  generalLimiter,
  UserProfileController.updateUserProfile
);

/**
 * @swagger
 * /api/users/companies:
 *   get:
 *     summary: Get user companies
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User companies retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       logo_url:
 *                         type: string
 *                       description:
 *                         type: string
 *                       sector:
 *                         type: string
 *                       role:
 *                         type: string
 *                       position:
 *                         type: string
 *       401:
 *         description: User not authenticated
 *       500:
 *         description: Internal server error
 */
router.get('/companies',
  authenticateToken,
  generalLimiter,
  UserProfileController.getUserCompanies
);

/**
 * @swagger
 * /api/users/team:
 *   get:
 *     summary: Get team members by role
 *     tags: [User Profile]
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [director, founding_member, media_manager, member, user]
 *         description: Filter by user role
 *     responses:
 *       200:
 *         description: Team members retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       first_name:
 *                         type: string
 *                       last_name:
 *                         type: string
 *                       bio:
 *                         type: string
 *                       avatar_url:
 *                         type: string
 *                       position:
 *                         type: string
 *                       company_name:
 *                         type: string
 *                       location:
 *                         type: string
 *                       role:
 *                         type: string
 *       500:
 *         description: Internal server error
 */
router.get('/team',
  generalLimiter,
  UserProfileController.getTeamMembers
);

export default router;
