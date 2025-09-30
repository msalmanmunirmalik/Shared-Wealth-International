import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import { DatabaseService } from '../src/integrations/postgresql/database.js';
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
        const companies = await DatabaseService.findAll('companies', { where: { is_active: true } });
        res.json({ success: true, data: companies });
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
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({ message: 'Internal server error' });
});
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
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