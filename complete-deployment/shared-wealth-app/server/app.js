import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import companyRoutes from './routes/companies.js';
import adminRoutes from './routes/admin.js';
import contentRoutes from './routes/content.js';
import monitoringRoutes from './routes/monitoring.js';
import fundingRoutes from './routes/funding.js';
import healthRoutes from './routes/health.js';
import fileRoutes from './routes/files.js';
import emailRoutes from './routes/email.js';
import realtimeRoutes from './routes/realtime.js';
import dashboardRoutes from './routes/dashboard.js';
import reactionsRoutes from './routes/reactions.js';
import connectionsRoutes from './routes/connections.js';
import sharingRoutes from './routes/sharing.js';
import companyNewsRoutes from './routes/companyNews.js';
import unifiedContentRoutes from './routes/unifiedContent.js';
import unifiedSocialRoutes from './routes/unifiedSocial.js';
import unifiedDashboardRoutes from './routes/unifiedDashboard.js';
import unifiedFileRoutes from './routes/unifiedFile.js';
import unifiedUserRoutes from './routes/unifiedUser.js';
import userProfileRoutes from './routes/userProfile.js';
import setupRoutes from './routes/setup.js';
import { requestLogger, errorLogger, performanceLogger } from './middleware/logger.js';
import { performanceMonitor } from './middleware/monitoring.js';
import { csrfProtection } from './middleware/csrf.js';
import InputValidation from './middleware/inputValidation.js';
import { setupSwagger } from './swagger.js';
import { emailService } from './services/emailService.js';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error('❌ CRITICAL: JWT_SECRET environment variable is not set!');
    process.exit(1);
}
const app = express();
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
}));
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [
        'http://localhost:8080',
        'http://localhost:8081',
        'http://localhost:8082',
        'http://localhost:3000',
        'http://localhost:3001'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token']
}));
app.use(session({
    secret: process.env.SESSION_SECRET || 'wealth-pioneers-session-secret-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
    },
    name: 'wealth-pioneers-session'
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(InputValidation.sanitizeRequest);
app.use(InputValidation.validateRequestSize(10 * 1024 * 1024));
app.use('/uploads', express.static('uploads'));
app.use(requestLogger);
app.use(performanceLogger);
app.use(performanceMonitor);
setupSwagger(app);
const initializeEmailService = async () => {
    try {
        const emailConfig = {
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER || '',
                pass: process.env.SMTP_PASSWORD || ''
            },
            from: process.env.SMTP_FROM || 'noreply@sharedwealth.com',
            replyTo: process.env.SMTP_REPLY_TO
        };
        if (emailConfig.auth.user && emailConfig.auth.pass) {
            await emailService.initialize(emailConfig);
            console.log('✅ Email service initialized successfully');
        }
        else {
            console.log('⚠️ Email service not configured - SMTP credentials missing');
        }
    }
    catch (error) {
        console.error('❌ Failed to initialize email service:', error);
    }
};
initializeEmailService();
app.use(express.static(path.join(process.cwd(), 'dist')));
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});
app.use('/api/health', healthRoutes);
app.get('/api/csrf-token', csrfProtection.tokenEndpoint());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/content', contentRoutes);
app.use('/api/admin/monitoring', monitoringRoutes);
app.use('/api/admin/funding', fundingRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/realtime', realtimeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reactions', reactionsRoutes);
app.use('/api/connections', connectionsRoutes);
app.use('/api/sharing', sharingRoutes);
app.use('/api', companyNewsRoutes);
app.use('/api/content', unifiedContentRoutes);
app.use('/api/social', unifiedSocialRoutes);
app.use('/api/dashboard', unifiedDashboardRoutes);
app.use('/api/files', unifiedFileRoutes);
app.use('/api/users', unifiedUserRoutes);
app.use('/api/users', userProfileRoutes);
app.use('/api/setup', setupRoutes);
app.get('*', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});
app.use(errorLogger);
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'production' ? 'Something went wrong' : error.message
    });
});
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully...');
    process.exit(0);
});
process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully...');
    process.exit(0);
});
export default app;
//# sourceMappingURL=app.js.map