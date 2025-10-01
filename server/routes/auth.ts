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

// Seed test companies endpoint - temporary for testing
router.post('/seed-companies', generalLimiter, async (req, res) => {
  try {
    console.log('🌱 Seeding test companies...');
    
    const testCompanies = [
      {
        name: 'GreenTech Solutions',
        description: 'Sustainable technology solutions for a better future',
        industry: 'Technology',
        sector: 'Clean Energy',
        size: '50-200',
        location: 'San Francisco, CA',
        website: 'https://greentech-solutions.com',
        status: 'approved'
      },
      {
        name: 'EcoFriendly Manufacturing',
        description: 'Environmentally conscious manufacturing processes',
        industry: 'Manufacturing',
        sector: 'Sustainability',
        size: '200-500',
        location: 'Portland, OR',
        website: 'https://ecofriendly-mfg.com',
        status: 'approved'
      },
      {
        name: 'Social Impact Ventures',
        description: 'Investment firm focused on social and environmental impact',
        industry: 'Finance',
        sector: 'Impact Investing',
        size: '10-50',
        location: 'New York, NY',
        website: 'https://socialimpact-ventures.com',
        status: 'approved'
      },
      {
        name: 'Community Development Corp',
        description: 'Building stronger communities through sustainable development',
        industry: 'Real Estate',
        sector: 'Community Development',
        size: '100-500',
        location: 'Chicago, IL',
        website: 'https://community-dev-corp.com',
        status: 'approved'
      },
      {
        name: 'Renewable Energy Partners',
        description: 'Leading provider of renewable energy solutions',
        industry: 'Energy',
        sector: 'Renewable Energy',
        size: '500+',
        location: 'Austin, TX',
        website: 'https://renewable-energy-partners.com',
        status: 'approved'
      }
    ];
    
    // Check if companies already exist
    const existingResult = await pool.query('SELECT COUNT(*) FROM companies');
    const existingCount = parseInt(existingResult.rows[0].count);
    
    if (existingCount > 0) {
      console.log(`⚠️ Found ${existingCount} existing companies. Skipping seed.`);
      return res.json({
        success: true,
        message: `Found ${existingCount} existing companies. Skipping seed.`,
        existingCount
      });
    }
    
    const results = [];
    
    // Insert test companies
    for (let i = 0; i < testCompanies.length; i++) {
      const company = testCompanies[i];
      console.log(`Creating: ${company.name}`);
      
      try {
        const result = await pool.query(`
          INSERT INTO companies (
            name, description, industry, sector, size, location, website, status, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
          RETURNING id, name
        `, [
          company.name,
          company.description,
          company.industry,
          company.sector,
          company.size,
          company.location,
          company.website,
          company.status
        ]);
        
        results.push({
          name: result.rows[0].name,
          id: result.rows[0].id,
          status: 'created'
        });
        
        console.log(`✅ Created: ${result.rows[0].name} (ID: ${result.rows[0].id})`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`❌ Error creating ${company.name}:`, errorMessage);
        results.push({
          name: company.name,
          status: 'error',
          error: errorMessage
        });
      }
    }
    
    // Verify the seed
    const verifyResult = await pool.query('SELECT COUNT(*) FROM companies WHERE status = $1', ['approved']);
    const totalCount = verifyResult.rows[0].count;
    
    console.log(`🎉 Seed completed! Total approved companies: ${totalCount}`);
    
    res.json({
      success: true,
      message: 'Test companies seeded successfully',
      results,
      totalCount: parseInt(totalCount)
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Seed failed:', errorMessage);
    res.status(500).json({
      success: false,
      message: 'Seed failed',
      error: errorMessage
    });
  }
});

export default router;
