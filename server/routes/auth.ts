import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { authValidation, handleValidationErrors } from '../middleware/validation.js';
import { authLimiter, generalLimiter } from '../middleware/rateLimit.js';
import { authenticateToken, requireAdmin, AuthenticatedRequest } from '../middleware/auth.js';

const router: ReturnType<typeof Router> = Router();

/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     summary: Sign in user
 *     tags: [Authentication]
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
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 description: User's password
 *     responses:
 *       200:
 *         description: Sign in successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     access_token:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 *       400:
 *         description: Validation error
 */
router.post('/signin', authLimiter, authValidation.signIn, handleValidationErrors, AuthController.signIn);

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Sign up new user
 *     tags: [Authentication]
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
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 description: User's password
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *       400:
 *         description: Validation error or user already exists
 */
router.post('/signup', authLimiter, authValidation.signUp, handleValidationErrors, AuthController.signUp);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password with token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 description: Password reset token
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *                 description: New password
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Validation error or invalid token
 */
router.post('/reset-password', authLimiter, authValidation.resetPassword, handleValidationErrors, AuthController.resetPassword);

/**
 * @swagger
 * /api/auth/admin/check/{userId}:
 *   get:
 *     summary: Check if user is admin
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to check
 *     responses:
 *       200:
 *         description: Admin status checked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isAdmin:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User is not admin
 */
router.get('/admin/check/:userId', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const { userId } = req.params;
    
    // Check if the requesting user is checking their own admin status
    if (req.user?.id !== userId) {
      res.status(403).json({
        success: false,
        message: 'Can only check your own admin status'
      });
      return;
    }
    
    res.json({
      success: true,
      isAdmin: true
    });
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
