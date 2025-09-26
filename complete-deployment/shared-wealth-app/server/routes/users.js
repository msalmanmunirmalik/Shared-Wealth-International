import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { generalLimiter } from '../middleware/rateLimit.js';
const router = Router();
router.get('/me', authenticateToken, generalLimiter, AuthController.getCurrentUser);
export default router;
//# sourceMappingURL=users.js.map