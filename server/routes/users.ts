import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { generalLimiter } from '../middleware/rateLimit.js';

const router: ReturnType<typeof Router> = Router();

/**
 * @route   GET /api/users/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', 
  authenticateToken,
  generalLimiter,
  AuthController.getCurrentUser
);

export default router;
