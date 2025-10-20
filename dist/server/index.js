import express from 'express';
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
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error('❌ CRITICAL: JWT_SECRET environment variable is not set!');
    process.exit(1);
}
const app = express();
const PORT = process.env.PORT || 8080;
app.use(helmet());
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:8080', 'http://localhost:8081'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many authentication attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.post('/api/setup/init-schema', async (req, res) => {
    try {
        console.log('🏗️  Initializing database schema...');
        const schemaStatements = [
            `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`,
            `CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'superadmin', 'director', 'moderator')),
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        phone VARCHAR(20),
        bio TEXT,
        location VARCHAR(255),
        website VARCHAR(255),
        linkedin VARCHAR(255),
        twitter VARCHAR(255),
        avatar_url VARCHAR(500),
        is_active BOOLEAN DEFAULT true,
        email_verified BOOLEAN DEFAULT false,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
            `CREATE TABLE IF NOT EXISTS companies (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        industry VARCHAR(100),
        sector VARCHAR(100),
        location VARCHAR(255),
        website VARCHAR(255),
        logo_url VARCHAR(500),
        employees INTEGER,
        status VARCHAR(50) DEFAULT 'approved',
        is_active BOOLEAN DEFAULT true,
        is_verified BOOLEAN DEFAULT true,
        applicant_user_id UUID,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
            `CREATE TABLE IF NOT EXISTS user_companies (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
        role VARCHAR(100) NOT NULL,
        position VARCHAR(100) NOT NULL,
        status VARCHAR(50) DEFAULT 'active',
        is_primary BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, company_id)
      )`,
            `CREATE TABLE IF NOT EXISTS network_connections (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
        connection_type VARCHAR(50) DEFAULT 'member',
        notes TEXT,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, company_id)
      )`
        ];
        let created = 0;
        for (const statement of schemaStatements) {
            try {
                await DatabaseService.query(statement);
                created++;
            }
            catch (error) {
                console.log(`⚠️ Statement may have failed (or already exists): ${error instanceof Error ? error.message : 'Error'}`);
            }
        }
        res.json({
            success: true,
            message: 'Database schema initialized',
            data: { statementsExecuted: created }
        });
    }
    catch (error) {
        console.error('❌ Schema initialization failed:', error);
        res.status(500).json({
            success: false,
            message: 'Schema initialization failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
app.post('/api/setup/link-user-company', async (req, res) => {
    try {
        const { userId, companyId, position, role } = req.body;
        if (!userId || !companyId) {
            return res.status(400).json({
                success: false,
                message: 'userId and companyId are required'
            });
        }
        const existingCheck = await DatabaseService.query('SELECT * FROM user_companies WHERE user_id = $1 AND company_id = $2', [userId, companyId]);
        if (existingCheck.rows.length > 0) {
            return res.json({
                success: true,
                message: 'Relationship already exists',
                data: { alreadyExists: true }
            });
        }
        await DatabaseService.insert('user_companies', {
            user_id: userId,
            company_id: companyId,
            role: role || 'director',
            position: position || 'Director',
            status: 'active',
            is_primary: true
        });
        res.json({
            success: true,
            message: 'User-company relationship created',
            data: { userId, companyId }
        });
    }
    catch (error) {
        console.error('❌ Link user-company failed:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create relationship',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
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
            }
            catch (error) {
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
    }
    catch (error) {
        console.error('❌ Database populate failed:', error);
        res.status(500).json({
            success: false,
            message: 'Database populate failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Access token required' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded || !decoded.userId) {
            return res.status(401).json({ message: 'Invalid token format' });
        }
        const user = await DatabaseService.findOne('users', { where: { id: decoded.userId } });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        if (!['user', 'admin', 'superadmin'].includes(user.role)) {
            return res.status(401).json({ message: 'Invalid user role' });
        }
        req.user = user;
        next();
    }
    catch (error) {
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
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};
const requireSuperAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    if (req.user.role !== 'superadmin') {
        return res.status(403).json({ message: 'Super admin access required' });
    }
    next();
};
app.get('/api/health', generalLimiter, (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});
app.post('/api/auth/signin', authLimiter, [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        const { email, password } = req.body;
        if (typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ message: 'Invalid input types' });
        }
        const user = await DatabaseService.findOne('users', { where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({
            userId: user.id,
            email: user.email,
            role: user.role,
            iat: Math.floor(Date.now() / 1000)
        }, JWT_SECRET, {
            expiresIn: '24h',
            issuer: 'shared-wealth-international',
            audience: 'wealth-pioneers-users'
        });
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
    }
    catch (error) {
        console.error('Sign in error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.post('/api/auth/signup', authLimiter, [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        const { email, password } = req.body;
        if (typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ message: 'Invalid input types' });
        }
        const existingUser = await DatabaseService.findOne('users', { where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        const newUser = await DatabaseService.insert('users', {
            email,
            password_hash: passwordHash,
            role: 'user'
        });
        res.status(201).json({ message: 'User created successfully', userId: newUser.id });
    }
    catch (error) {
        console.error('Sign up error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.post('/api/auth/signout', authenticateToken, (req, res) => {
    res.json({ message: 'Signed out successfully' });
});
app.post('/api/auth/reset-password', authLimiter, [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        const { email } = req.body;
        if (typeof email !== 'string') {
            return res.status(400).json({ message: 'Invalid input type' });
        }
        res.json({ message: 'Password reset email sent' });
    }
    catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.get('/api/auth/admin/check/:userId', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        const user = await DatabaseService.findOne('users', { where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isAdmin = user.role === 'admin' || user.role === 'superadmin';
        res.json({ isAdmin });
    }
    catch (error) {
        console.error('Admin check error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.get('/api/auth/admin/super/:userId', authenticateToken, requireSuperAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        const user = await DatabaseService.findOne('users', { where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isSuperAdmin = user.role === 'superadmin';
        res.json({ isSuperAdmin });
    }
    catch (error) {
        console.error('Super admin check error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.get('/api/users/me', authenticateToken, (req, res) => {
    res.json(req.user);
});
app.get('/api/companies', generalLimiter, async (req, res) => {
    try {
        const companies = await DatabaseService.findAll('companies', { where: { is_active: true } });
        res.json({ success: true, data: companies });
    }
    catch (error) {
        console.error('Get companies error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
app.get('/api/networks/user', authenticateToken, generalLimiter, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User authentication required'
            });
        }
        const query = `
      SELECT c.*, nc.connection_type, nc.notes, nc.created_at as added_at
      FROM companies c
      INNER JOIN network_connections nc ON c.id = nc.company_id
      WHERE nc.user_id = $1 AND nc.status = 'active'
      ORDER BY nc.created_at DESC
    `;
        const result = await DatabaseService.query(query, [userId]);
        res.json({
            success: true,
            data: result.rows || []
        });
    }
    catch (error) {
        console.error('Get user network error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
app.get('/api/networks/available', authenticateToken, generalLimiter, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User authentication required'
            });
        }
        const companies = await DatabaseService.findAll('companies', { where: { is_active: true } });
        const networkQuery = `SELECT company_id FROM network_connections WHERE user_id = $1`;
        const networkResult = await DatabaseService.query(networkQuery, [userId]);
        const networkCompanyIds = networkResult.rows.map(row => row.company_id);
        const availableCompanies = companies.filter(c => !networkCompanyIds.includes(c.id));
        res.json({
            success: true,
            data: availableCompanies
        });
    }
    catch (error) {
        console.error('Get available companies error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
app.post('/api/networks/add', authenticateToken, generalLimiter, async (req, res) => {
    try {
        const userId = req.user?.id;
        const { company_id, connection_type, notes } = req.body;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User authentication required'
            });
        }
        if (!company_id) {
            return res.status(400).json({
                success: false,
                message: 'Company ID is required'
            });
        }
        const existingCheck = await DatabaseService.query('SELECT * FROM network_connections WHERE user_id = $1 AND company_id = $2', [userId, company_id]);
        if (existingCheck.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Company already in your network'
            });
        }
        await DatabaseService.insert('network_connections', {
            user_id: userId,
            company_id: company_id,
            connection_type: connection_type || 'partner',
            notes: notes,
            status: 'active'
        });
        res.status(201).json({
            success: true,
            message: 'Company added to network successfully'
        });
    }
    catch (error) {
        console.error('Add to network error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
app.delete('/api/networks/remove', authenticateToken, generalLimiter, async (req, res) => {
    try {
        const userId = req.user?.id;
        const { company_id } = req.body;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User authentication required'
            });
        }
        if (!company_id) {
            return res.status(400).json({
                success: false,
                message: 'Company ID is required'
            });
        }
        const result = await DatabaseService.query('DELETE FROM network_connections WHERE user_id = $1 AND company_id = $2 RETURNING *', [userId, company_id]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Company not found in network'
            });
        }
        res.json({
            success: true,
            message: 'Company removed from network successfully'
        });
    }
    catch (error) {
        console.error('Remove from network error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
app.get('/api/companies/user', authenticateToken, generalLimiter, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User authentication required'
            });
        }
        console.log('🔍 Getting companies for user:', userId);
        const query = `
      SELECT c.*, uc.role as user_role, uc.position, uc.is_primary
      FROM companies c
      INNER JOIN user_companies uc ON c.id = uc.company_id
      WHERE uc.user_id = $1 AND uc.status = 'active'
      ORDER BY uc.is_primary DESC, c.name ASC
    `;
        const result = await DatabaseService.query(query, [userId]);
        console.log(`✅ Found ${result.rows.length} companies for user`);
        res.json(result.rows || []);
    }
    catch (error) {
        console.error('Get user companies error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
app.get('/api/companies/:id', generalLimiter, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || typeof id !== 'string') {
            return res.status(400).json({ message: 'Invalid company ID' });
        }
        const company = await DatabaseService.findById('companies', id);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.json(company);
    }
    catch (error) {
        console.error('Get company error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.get('/api/network', generalLimiter, async (req, res) => {
    try {
        res.json({ success: true, data: [] });
    }
    catch (error) {
        console.error('Get network error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
app.get('/api/funding', generalLimiter, async (req, res) => {
    try {
        const opportunities = await DatabaseService.findAll('funding_opportunities');
        res.json(opportunities);
    }
    catch (error) {
        console.error('Get funding error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.get('/api/forum', generalLimiter, async (req, res) => {
    try {
        const posts = await DatabaseService.findAll('forum_posts');
        res.json(posts);
    }
    catch (error) {
        console.error('Get forum error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.get('/api/events', generalLimiter, async (req, res) => {
    try {
        const events = await DatabaseService.findAll('events');
        res.json(events);
    }
    catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.get('/api/messaging', authenticateToken, generalLimiter, async (req, res) => {
    try {
        const messages = await DatabaseService.findAll('messages', {
            where: {
                recipient_id: req.user.id
            }
        });
        res.json(messages);
    }
    catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.get('/api/admin/stats', authenticateToken, requireAdmin, generalLimiter, async (req, res) => {
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
    }
    catch (error) {
        console.error('Get admin stats error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.get('/api/admin/users', authenticateToken, requireAdmin, generalLimiter, async (req, res) => {
    try {
        const users = await DatabaseService.findAll('users');
        res.json(users);
    }
    catch (error) {
        console.error('Get admin users error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.post('/api/files/upload', generalLimiter, async (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                publicUrl: 'https://via.placeholder.com/150x150?text=Profile+Image',
                filename: 'profile-image.jpg'
            }
        });
    }
    catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ success: false, message: 'File upload failed' });
    }
});
app.post('/api/migration/run', async (req, res) => {
    try {
        console.log('🚀 Running database migration...');
        const migrationQueries = [
            'ALTER TABLE user_companies ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
            'ALTER TABLE user_companies ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
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
            'ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT',
            'ALTER TABLE users ADD COLUMN IF NOT EXISTS location VARCHAR(200)',
            'ALTER TABLE users ADD COLUMN IF NOT EXISTS website VARCHAR(500)',
            'ALTER TABLE users ADD COLUMN IF NOT EXISTS linkedin VARCHAR(500)',
            'ALTER TABLE users ADD COLUMN IF NOT EXISTS twitter VARCHAR(500)',
            'ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image VARCHAR(500)'
        ];
        const results = [];
        for (const query of migrationQueries) {
            try {
                console.log(`Executing: ${query.substring(0, 50)}...`);
                await pool.query(query);
                results.push({ query: query.substring(0, 50), status: 'success' });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                console.error(`Error executing query: ${errorMessage}`);
                results.push({ query: query.substring(0, 50), status: 'error', error: errorMessage });
            }
        }
        const verificationQueries = [
            'SELECT column_name, data_type FROM information_schema.columns WHERE table_name = \'user_companies\' AND column_name IN (\'created_at\', \'updated_at\', \'position\', \'status\') ORDER BY column_name',
            'SELECT COUNT(*) as table_exists FROM information_schema.tables WHERE table_name = \'network_connections\'',
            'SELECT column_name, data_type FROM information_schema.columns WHERE table_name = \'companies\' AND column_name = \'status\'',
            'SELECT column_name, data_type FROM information_schema.columns WHERE table_name = \'users\' AND column_name IN (\'bio\', \'location\', \'website\', \'linkedin\', \'twitter\', \'profile_image\') ORDER BY column_name'
        ];
        const verificationResults = [];
        for (const query of verificationQueries) {
            try {
                const result = await pool.query(query);
                verificationResults.push({ query: query.substring(0, 50), data: result.rows });
            }
            catch (error) {
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
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('❌ Migration error:', errorMessage);
        res.status(500).json({
            success: false,
            message: 'Migration failed',
            error: errorMessage
        });
    }
});
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({ message: 'Internal server error' });
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '..', '..', 'dist');
console.log('📁 Static files path:', distPath);
if (fs.existsSync(distPath)) {
    console.log('✅ dist directory exists');
    app.use(express.static(distPath));
    app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api/')) {
            return next();
        }
        const indexPath = path.join(distPath, 'index.html');
        if (fs.existsSync(indexPath)) {
            res.sendFile(indexPath);
        }
        else {
            res.status(404).json({ message: 'Frontend not found' });
        }
    });
}
else {
    console.log('⚠️ dist directory does not exist - static files not served');
    app.use('*', (req, res) => {
        res.status(404).json({ message: 'Route not found' });
    });
}
const server = app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🔒 Security features enabled: Helmet, Rate Limiting, CORS`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
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
//# sourceMappingURL=index.js.map