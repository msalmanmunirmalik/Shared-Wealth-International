import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { authValidation, handleValidationErrors } from '../middleware/validation.js';
import { authLimiter, generalLimiter } from '../middleware/rateLimit.js';
import { authenticateToken, requireAdmin, AuthenticatedRequest } from '../middleware/auth.js';
import pool from '../../src/integrations/postgresql/config.js';

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

// Migration endpoint - temporary for database schema fixes
router.post('/migration/run', generalLimiter, async (req, res) => {
  try {
    console.log('🚀 Running database migration...');
    
    const migrationQueries = [
      // 1. Add missing columns to users table
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS location VARCHAR(200)',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS website VARCHAR(500)',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS linkedin VARCHAR(500)',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS twitter VARCHAR(500)',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image VARCHAR(500)',
      
      // 2. Add missing columns to user_companies table
      'ALTER TABLE user_companies ADD COLUMN IF NOT EXISTS position VARCHAR(100)',
      'ALTER TABLE user_companies ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT \'active\'',
      'ALTER TABLE user_companies ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
      'ALTER TABLE user_companies ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
      
      // 3. Create network_connections table
      `CREATE TABLE IF NOT EXISTS network_connections (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
        connection_type VARCHAR(50) DEFAULT 'member' CHECK (connection_type IN ('member', 'partner', 'supplier', 'customer')),
        status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, company_id)
      )`,
      
      // 4. Add status column to companies if it doesn't exist
      'ALTER TABLE companies ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT \'approved\''
    ];
    
    const results: Array<{ query: string; status: string; error?: string }> = [];
    
    for (const query of migrationQueries) {
      try {
        console.log(`Executing: ${query.substring(0, 50)}...`);
        await pool.query(query);
        results.push({ query: query.substring(0, 50), status: 'success' });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error executing query: ${errorMessage}`);
        results.push({ query: query.substring(0, 50), status: 'error', error: errorMessage });
      }
    }
    
    // Verification queries
    const verificationQueries = [
      'SELECT column_name, data_type FROM information_schema.columns WHERE table_name = \'users\' AND column_name IN (\'bio\', \'location\', \'website\', \'linkedin\', \'twitter\', \'profile_image\') ORDER BY column_name',
      'SELECT column_name, data_type FROM information_schema.columns WHERE table_name = \'user_companies\' AND column_name IN (\'position\', \'status\', \'created_at\', \'updated_at\') ORDER BY column_name',
      'SELECT COUNT(*) as table_exists FROM information_schema.tables WHERE table_name = \'network_connections\'',
      'SELECT column_name, data_type FROM information_schema.columns WHERE table_name = \'companies\' AND column_name = \'status\''
    ];
    
    const verificationResults: Array<{ query: string; data?: any[]; error?: string }> = [];
    
    for (const query of verificationQueries) {
      try {
        const result = await pool.query(query);
        verificationResults.push({ query: query.substring(0, 50), data: result.rows });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        verificationResults.push({ query: query.substring(0, 50), error: errorMessage });
      }
    }
    
    console.log('✅ Migration completed successfully');
    
    res.json({
      success: true,
      message: 'Database migration completed',
      results,
      verification: verificationResults
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Migration error:', errorMessage);
    res.status(500).json({
      success: false,
      message: 'Migration failed',
      error: errorMessage
    });
  }
});

export default router;
