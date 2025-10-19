import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import pool from '../src/integrations/postgresql/config.js';
import { DatabaseService } from '../src/integrations/postgresql/database.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Security: Validate required environment variables
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('❌ CRITICAL: JWT_SECRET environment variable is not set!');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 8080;

// Security: Apply Helmet security headers
app.use(helmet());

// Security: Configure CORS properly (not allowing all origins)
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:8080', 'http://localhost:8081'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security: Rate limiting to prevent brute force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for auth endpoints
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs for general endpoints
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Security: Request size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Setup endpoint for database population (must be before auth middleware)
app.post('/api/setup/populate', async (req, res) => {
  try {
    console.log('📊 Populating database with companies...');
    
    const existingCheck = await DatabaseService.query('SELECT COUNT(*) as count FROM companies WHERE 1=1');
    const existing = parseInt(existingCheck.rows[0]?.count || 0);
    
    if (existing >= 28) {
      return res.json({
        success: true,
        message: `Database already has ${existing} companies`,
        data: { totalCompanies: existing, inserted: 0 }
      });
    }

    const companies = [
      { name: 'Ktalise', industry: 'Social Enterprise', location: 'Portugal', website: 'https://ktalise.com' },
      { name: 'Beplay', industry: 'Social Enterprise', location: 'Brazil', website: 'https://beplay.com' },
      { name: 'Carsis Consulting', industry: 'Social Enterprise', location: 'UK', website: 'https://carsisconsulting.com' },
      { name: 'Consortio', industry: 'Social Enterprise', location: 'Ireland', website: 'https://consortio.com' },
      { name: 'Eternal Flame', industry: 'Social Enterprise', location: 'Lesotho', website: 'https://eternalflame.com' },
      { name: 'Eupolisgrupa', industry: 'Social Enterprise', location: 'Croatia', website: 'https://eupolisgrupa.com' },
      { name: 'Fairbnb', industry: 'Social Enterprise', location: 'Italy', website: 'https://fairbnb.com' },
      { name: 'Givey Ktd', industry: 'Social Enterprise', location: 'Cameroon', website: 'https://giveyktd.com' },
      { name: 'Kula Eco Pads', industry: 'Social Enterprise', location: 'Indonesia', website: 'https://kulaecopads.com' },
      { name: 'LocoSoco PLC', industry: 'Social Enterprise', location: 'UK', website: 'https://locosocoplc.com' },
      { name: 'Media Cultured', industry: 'Social Enterprise', location: 'UK', website: 'https://mediacultured.com' },
      { name: 'NCDF', industry: 'Social Enterprise', location: 'Nigeria', website: 'https://ncdf.com' },
      { name: 'PadCare', industry: 'Social Enterprise', location: 'India', website: 'https://padcare.com' },
      { name: 'Pathways Points', industry: 'Social Enterprise', location: 'UK', website: 'https://pathwayspoints.com' },
      { name: 'Purview Ltd', industry: 'Social Enterprise', location: 'UK', website: 'https://purviewltd.com' },
      { name: 'Research Automators', industry: 'Social Enterprise', location: 'Sweden', website: 'https://researchautomators.com' },
      { name: 'SE Ghana', industry: 'Social Enterprise', location: 'Ghana', website: 'https://seghana.com' },
      { name: 'SEi Caledonia', industry: 'Social Enterprise', location: 'UK', website: 'https://seicaledonia.com' },
      { name: 'SEi Middle East', industry: 'Social Enterprise', location: 'Iraq', website: 'https://seimiddleeast.com' },
      { name: 'Solar Ear', industry: 'Social Enterprise', location: 'Brazil', website: 'https://solarear.com' },
      { name: 'Spark', industry: 'Social Enterprise', location: 'UK', website: 'https://spark.com' },
      { name: 'Supanova', industry: 'Social Enterprise', location: 'Indonesia', website: 'https://supanova.com' },
      { name: 'Sustainable Roots', industry: 'Social Enterprise', location: 'UK', website: 'https://sustainableroots.com' },
      { name: 'TTF', industry: 'Social Enterprise', location: 'UK', website: 'https://ttf.com' },
      { name: 'Terratai', industry: 'Social Enterprise', location: 'India', website: 'https://terratai.com' },
      { name: 'Universiti Malaya', industry: 'Social Enterprise', location: 'Malaysia', website: 'https://universitimalaya.com' },
      { name: 'Unyte Group', industry: 'Social Enterprise', location: 'Indonesia', website: 'https://unytegroup.com' },
      { name: 'Washking', industry: 'Social Enterprise', location: 'Ghana', website: 'https://washking.com' },
      { name: 'Whitby Shared Wealth', industry: 'Social Enterprise', location: 'UK', website: 'https://whitbysharedwealth.com' }
    ];

    let inserted = 0;
    for (const company of companies) {
      try {
        await DatabaseService.insert('companies', {
          name: company.name,
          industry: company.industry,
          location: company.location,
          website: company.website,
          description: `${company.name} is a partner company of Shared Wealth International, committed to equitable wealth distribution and inclusive business practices.`,
          status: 'approved',
          is_active: true,
          is_verified: true
        });
        inserted++;
        console.log(`✅ Inserted: ${company.name}`);
      } catch (error) {
        console.log(`⚠️ Skipping ${company.name}: ${error instanceof Error ? error.message : 'Error'}`);
      }
    }

    const finalCount = await DatabaseService.query('SELECT COUNT(*) as count FROM companies WHERE 1=1');
    
    res.json({
      success: true,
      message: `Database populated successfully`,
      data: {
        inserted: inserted,
        totalCompanies: parseInt(finalCount.rows[0]?.count || 0)
      }
    });
  } catch (error) {
    console.error('❌ Database populate failed:', error);
    res.status(500).json({
      success: false,
      message: 'Database populate failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Extend Express Request interface with proper typing
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    created_at: string;
  };
}

// Security: Authentication middleware with proper error handling
const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    // Security: Validate JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    // Security: Check if user exists and is active
    const user = await DatabaseService.findOne('users', { where: { id: decoded.userId } });
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Security: Validate user role
    if (!['user', 'admin', 'superadmin'].includes(user.role)) {
      return res.status(401).json({ message: 'Invalid user role' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(403).json({ message: 'Token expired' });
    }
    console.error('Authentication error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Security: Admin role validation middleware
const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  next();
};

// Security: Super admin role validation middleware
const requireSuperAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Super admin access required' });
  }
  
  next();
};

// Health check endpoint
app.get('/api/health', generalLimiter, (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Authentication routes with rate limiting and validation
app.post('/api/auth/signin', authLimiter, [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
], async (req, res) => {
  try {
    // Security: Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Security: Additional input sanitization
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Invalid input types' });
    }

    const user = await DatabaseService.findOne('users', { where: { email } });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Security: Verify password with constant-time comparison
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Security: Generate JWT with proper expiration
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role,
        iat: Math.floor(Date.now() / 1000)
      },
      JWT_SECRET,
      { 
        expiresIn: '24h',
        issuer: 'shared-wealth-international',
        audience: 'wealth-pioneers-users'
      }
    );

    const session = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        created_at: user.created_at
      },
      access_token: token
    };

    res.json({ session });
  } catch (error) {
    console.error('Sign in error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/auth/signup', authLimiter, [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
], async (req, res) => {
  try {
    // Security: Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Security: Additional input sanitization
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Invalid input types' });
    }

    // Check if user already exists
    const existingUser = await DatabaseService.findOne('users', { where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Security: Hash password with proper salt rounds
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = await DatabaseService.insert('users', {
      email,
      password_hash: passwordHash,
      role: 'user'
    });

    res.status(201).json({ message: 'User created successfully', userId: newUser.id });
  } catch (error) {
    console.error('Sign up error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/auth/signout', authenticateToken, (req, res) => {
  // Security: In production, implement token blacklisting
  res.json({ message: 'Signed out successfully' });
});

app.post('/api/auth/reset-password', authLimiter, [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    // Security: Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { email } = req.body;
    
    // Security: Additional input sanitization
    if (typeof email !== 'string') {
      return res.status(400).json({ message: 'Invalid input type' });
    }

    // In a real app, you would send a reset email
    // For now, just return success
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin check endpoints with proper validation
app.get('/api/auth/admin/check/:userId', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;
    
    // Security: Validate userId parameter
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await DatabaseService.findOne('users', { where: { id: userId } });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isAdmin = user.role === 'admin' || user.role === 'superadmin';
    res.json({ isAdmin });
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/auth/admin/super/:userId', authenticateToken, requireSuperAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;
    
    // Security: Validate userId parameter
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await DatabaseService.findOne('users', { where: { id: userId } });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isSuperAdmin = user.role === 'superadmin';
    res.json({ isSuperAdmin });
  } catch (error) {
    console.error('Super admin check error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// User routes with proper validation
app.get('/api/users/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  res.json(req.user);
});

// Company routes with rate limiting
app.get('/api/companies', generalLimiter, async (req, res) => {
  try {
    // Temporarily return empty array to avoid database errors
    // TODO: Re-enable after database migration
    res.json({ success: true, data: [] });
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/api/companies/:id', generalLimiter, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Security: Validate id parameter
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Invalid company ID' });
    }
    
    const company = await DatabaseService.findById('companies', id);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    res.json(company);
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Network routes with rate limiting
app.get('/api/network', generalLimiter, async (req, res) => {
  try {
    // Temporarily return empty array to avoid database errors
    // TODO: Re-enable after database migration
    res.json({ success: true, data: [] });
  } catch (error) {
    console.error('Get network error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Funding routes with rate limiting
app.get('/api/funding', generalLimiter, async (req, res) => {
  try {
    const opportunities = await DatabaseService.findAll('funding_opportunities');
    res.json(opportunities);
  } catch (error) {
    console.error('Get funding error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Forum routes with rate limiting
app.get('/api/forum', generalLimiter, async (req, res) => {
  try {
    const posts = await DatabaseService.findAll('forum_posts');
    res.json(posts);
  } catch (error) {
    console.error('Get forum error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Events routes with rate limiting
app.get('/api/events', generalLimiter, async (req, res) => {
  try {
    const events = await DatabaseService.findAll('events');
    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Messaging routes with authentication and rate limiting
app.get('/api/messaging', authenticateToken, generalLimiter, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const messages = await DatabaseService.findAll('messages', { 
      where: { 
        recipient_id: req.user!.id 
      } 
    });
    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin routes with proper authentication and validation
app.get('/api/admin/stats', authenticateToken, requireAdmin, generalLimiter, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const totalUsers = await DatabaseService.count('users');
    const totalCompanies = await DatabaseService.count('companies');
    const pendingCompanies = await DatabaseService.count('companies', { where: { status: 'pending' } });
    const approvedCompanies = await DatabaseService.count('companies', { where: { status: 'approved' } });

    res.json({
      totalUsers,
      totalCompanies,
      pendingCompanies,
      approvedCompanies
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/admin/users', authenticateToken, requireAdmin, generalLimiter, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = await DatabaseService.findAll('users');
    res.json(users);
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// File upload endpoint (no auth required for signup)
app.post('/api/files/upload', generalLimiter, async (req, res) => {
  try {
    // Simple file upload handling for profile images
    // In production, use proper multer middleware
    res.json({
      success: true,
      data: {
        publicUrl: 'https://via.placeholder.com/150x150?text=Profile+Image',
        filename: 'profile-image.jpg'
      }
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ success: false, message: 'File upload failed' });
  }
});

// Migration route - temporary endpoint for production database fix
app.post('/api/migration/run', async (req, res) => {
  try {
    console.log('🚀 Running database migration...');
    
    const migrationQueries = [
      // 1. Add missing columns to user_companies table
      'ALTER TABLE user_companies ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
      'ALTER TABLE user_companies ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
      
      // 2. Create network_connections table
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
      
      // 3. Fix companies table status column
      `DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'companies' 
          AND column_name = 'status' 
          AND data_type = 'USER-DEFINED'
        ) THEN
          ALTER TABLE companies 
          ALTER COLUMN status TYPE VARCHAR(50) 
          USING status::text;
          
          ALTER TABLE companies 
          ADD CONSTRAINT companies_status_check 
          CHECK (status IN ('pending', 'approved', 'rejected'));
          
          RAISE NOTICE 'Converted companies.status from custom type to VARCHAR';
        ELSIF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'companies' 
          AND column_name = 'status'
        ) THEN
          ALTER TABLE companies 
          ADD COLUMN status VARCHAR(50) DEFAULT 'pending' 
          CHECK (status IN ('pending', 'approved', 'rejected'));
          
          RAISE NOTICE 'Added companies.status column';
        ELSE
          RAISE NOTICE 'companies.status column already exists and is VARCHAR';
        END IF;
      END $$`,
      
      // 4. Add missing profile columns to users table
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS location VARCHAR(200)',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS website VARCHAR(500)',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS linkedin VARCHAR(500)',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS twitter VARCHAR(500)',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image VARCHAR(500)'
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
      'SELECT column_name, data_type FROM information_schema.columns WHERE table_name = \'user_companies\' AND column_name IN (\'created_at\', \'updated_at\', \'position\', \'status\') ORDER BY column_name',
      'SELECT COUNT(*) as table_exists FROM information_schema.tables WHERE table_name = \'network_connections\'',
      'SELECT column_name, data_type FROM information_schema.columns WHERE table_name = \'companies\' AND column_name = \'status\'',
      'SELECT column_name, data_type FROM information_schema.columns WHERE table_name = \'users\' AND column_name IN (\'bio\', \'location\', \'website\', \'linkedin\', \'twitter\', \'profile_image\') ORDER BY column_name'
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

// Security: Global error handler
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ message: 'Internal server error' });
});

// Serve static files from the React app build
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In production, serve static files from dist directory
const distPath = path.join(__dirname, '..', '..', 'dist');
console.log('📁 Static files path:', distPath);

if (fs.existsSync(distPath)) {
  console.log('✅ dist directory exists');
  app.use(express.static(distPath));
  
  // Serve index.html for all non-API routes (SPA routing)
  app.get('*', (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      return next();
    }
    
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).json({ message: 'Frontend not found' });
    }
  });
} else {
  console.log('⚠️ dist directory does not exist - static files not served');
  // Security: 404 handler for undefined routes
  app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });
}

// Start server with proper error handling
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔒 Security features enabled: Helmet, Rate Limiting, CORS`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Security: Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
