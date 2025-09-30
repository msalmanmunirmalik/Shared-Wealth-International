import { Router, type Router as ExpressRouter } from 'express';
import { UnifiedUserController } from '../controllers/unifiedUserController.js';
import { authenticateToken } from '../middleware/auth.js';
import { generalLimiter } from '../middleware/rateLimit.js';

const router: ExpressRouter = Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register new user
 *     tags: [Unified Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: User password
 *               firstName:
 *                 type: string
 *                 description: User first name
 *               lastName:
 *                 type: string
 *                 description: User last name
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 default: user
 *                 description: User role
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */
router.post('/register', generalLimiter, UnifiedUserController.register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user
 *     tags: [Unified Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email
 *               password:
 *                 type: string
 *                 description: User password
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post('/login', generalLimiter, UnifiedUserController.login);

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Unified Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/logout', authenticateToken, generalLimiter, UnifiedUserController.logout);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Unified Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/profile', authenticateToken, generalLimiter, UnifiedUserController.getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update current user profile
 *     tags: [Unified Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: User first name
 *               lastName:
 *                 type: string
 *                 description: User last name
 *               bio:
 *                 type: string
 *                 description: User bio
 *               avatar:
 *                 type: string
 *                 description: User avatar URL
 *               preferences:
 *                 type: object
 *                 description: User preferences
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.put('/profile', authenticateToken, generalLimiter, UnifiedUserController.updateProfile);

/**
 * @swagger
 * /api/users/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Unified Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: Current password
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 description: New password
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/change-password', authenticateToken, generalLimiter, UnifiedUserController.changePassword);

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Unified Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/:userId', authenticateToken, generalLimiter, UnifiedUserController.getUser);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Unified Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of users to retrieve
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of users to skip
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [user, admin]
 *         description: Filter by role
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get('/', authenticateToken, generalLimiter, UnifiedUserController.getAllUsers);

/**
 * @swagger
 * /api/users/{userId}:
 *   put:
 *     summary: Update user (admin only)
 *     tags: [Unified Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: User first name
 *               lastName:
 *                 type: string
 *                 description: User last name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 description: User role
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 description: User status
 *               bio:
 *                 type: string
 *                 description: User bio
 *               avatar:
 *                 type: string
 *                 description: User avatar URL
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.put('/:userId', authenticateToken, generalLimiter, UnifiedUserController.updateUser);

/**
 * @swagger
 * /api/users/{userId}:
 *   delete:
 *     summary: Delete user (admin only)
 *     tags: [Unified Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.delete('/:userId', authenticateToken, generalLimiter, UnifiedUserController.deleteUser);

/**
 * @swagger
 * /api/users/{userId}/stats:
 *   get:
 *     summary: Get user statistics
 *     tags: [Unified Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get('/:userId/stats', authenticateToken, generalLimiter, UnifiedUserController.getUserStats);

/**
 * @swagger
 * /api/users/{userId}/activity:
 *   get:
 *     summary: Get user activity
 *     tags: [Unified Users]
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
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of activities to retrieve
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of activities to skip
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by activity type
 *     responses:
 *       200:
 *         description: User activity retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get('/:userId/activity', authenticateToken, generalLimiter, UnifiedUserController.getUserActivity);

/**
 * @swagger
 * /api/users/verify-email/{token}:
 *   get:
 *     summary: Verify email address
 *     tags: [Unified Users]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Email verification token
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid verification token
 *       500:
 *         description: Internal server error
 */
router.get('/verify-email/:token', generalLimiter, UnifiedUserController.verifyEmail);

/**
 * @swagger
 * /api/users/request-password-reset:
 *   post:
 *     summary: Request password reset
 *     tags: [Unified Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */
router.post('/request-password-reset', generalLimiter, UnifiedUserController.requestPasswordReset);

/**
 * @swagger
 * /api/users/reset-password/{token}:
 *   post:
 *     summary: Reset password
 *     tags: [Unified Users]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 description: New password
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */
router.post('/reset-password/:token', generalLimiter, UnifiedUserController.resetPassword);

export default router;
