import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
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
import { requestLogger, errorLogger, performanceLogger } from './middleware/logger.js';
import { performanceMonitor } from './middleware/monitoring.js';
import { healthCheckLimiter } from './middleware/rateLimit.js';
import { setupSwagger } from './swagger.js';
import { emailService } from './services/emailService.js';
import { webSocketService } from './services/webSocketService.js';
// import { initSentry, sentryMiddleware } from './middleware/sentry.js';
// import { cache } from './services/cacheService.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('❌ CRITICAL: JWT_SECRET environment variable is not set!');
  process.exit(1);
}

const app: Application = express();

// Security middleware
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

// CORS configuration
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
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploads
app.use('/uploads', express.static('uploads'));

// Logging and monitoring middleware
app.use(requestLogger);
app.use(performanceLogger);
app.use(performanceMonitor);

// API documentation
setupSwagger(app as any);

// Initialize email service
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
    } else {
      console.log('⚠️ Email service not configured - SMTP credentials missing');
    }
  } catch (error) {
    console.error('❌ Failed to initialize email service:', error);
  }
};

// Initialize email service
initializeEmailService();

// Serve static files from dist directory
app.use(express.static(path.join(process.cwd(), 'dist')));

// Root route - serve the React app
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

// Health and monitoring endpoints
app.use('/api/health', healthRoutes);

// API routes
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

// Catch all handler - serve React app for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

// Error handling middleware (must be last)
// app.use(sentryMiddleware.errorHandler);
app.use(errorLogger);
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', error);
  
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? 'Something went wrong' : error.message
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  // await cache.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  // await cache.close();
  process.exit(0);
});

export default app;
