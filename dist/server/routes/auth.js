import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { authValidation, handleValidationErrors } from '../middleware/validation.js';
import { authLimiter, generalLimiter } from '../middleware/rateLimit.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import pool from '../../src/integrations/postgresql/config.js';
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
router.get('/debug/companies', generalLimiter, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM companies ORDER BY created_at DESC LIMIT 10');
        res.json({
            success: true,
            count: result.rows.length,
            companies: result.rows
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            error: errorMessage
        });
    }
});
router.get('/debug/user-companies-structure', generalLimiter, async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'user_companies' 
      ORDER BY ordinal_position
    `);
        res.json({
            success: true,
            table: 'user_companies',
            columns: result.rows
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            error: errorMessage
        });
    }
});
router.get('/debug/user-companies-data', generalLimiter, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM user_companies LIMIT 5');
        res.json({
            success: true,
            count: result.rows.length,
            user_companies: result.rows
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            error: errorMessage
        });
    }
});
router.get('/debug/users-data', generalLimiter, async (req, res) => {
    try {
        const result = await pool.query('SELECT id, email, first_name, last_name, role, created_at FROM users ORDER BY created_at DESC LIMIT 10');
        res.json({
            success: true,
            count: result.rows.length,
            users: result.rows
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            error: errorMessage
        });
    }
});
export default router;
//# sourceMappingURL=auth.js.map