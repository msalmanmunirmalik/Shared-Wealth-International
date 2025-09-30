import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { authValidation, handleValidationErrors } from '../middleware/validation.js';
import { authLimiter } from '../middleware/rateLimit.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
const router = Router();
router.post('/signin', authLimiter, authValidation.signIn, handleValidationErrors, AuthController.signIn);
router.post('/signup', authLimiter, authValidation.signUp, handleValidationErrors, AuthController.signUp);
router.post('/reset-password', authLimiter, authValidation.resetPassword, handleValidationErrors, AuthController.resetPassword);
router.get('/admin/check/:userId', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
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
    }
    catch (error) {
        console.error('Admin check error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
export default router;
//# sourceMappingURL=auth.js.map