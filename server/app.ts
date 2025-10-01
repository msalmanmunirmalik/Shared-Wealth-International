import express, { Application } from 'express';
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
import networkRoutes from './routes/networks.js';
import setupRoutes from './routes/setup.js';
import fixRoutes from './routes/fix.js';
import { requestLogger, errorLogger, performanceLogger } from './middleware/logger.js';
import { performanceMonitor } from './middleware/monitoring.js';
import { healthCheckLimiter } from './middleware/rateLimit.js';
import { csrfProtection } from './middleware/csrf.js';
import InputValidation from './middleware/inputValidation.js';
// Phase 2 imports (commented out for now - will be enabled after Redis setup)
// import { httpsMiddleware } from './middleware/httpsMiddleware.js';
// import CacheMiddleware from './middleware/cacheMiddleware.js';
// import { createCacheService } from './services/cacheService.js';
// import { MonitoringService } from './services/monitoringService.js';
// import { DatabaseService } from './services/databaseService.js';

import { setupSwagger } from './swagger.js';
import { emailService } from './services/emailService.js';
import { webSocketService } from './services/webSocketService.js';
// import { initSentry, sentryMiddleware } from './middleware/sentry.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('❌ CRITICAL: JWT_SECRET environment variable is not set!');
  process.exit(1);
}

const app: Application = express();

// Phase 2 services (commented out for now - will be enabled after Redis setup)
// let cacheService: any;
// let monitoringService: any;
// let cacheMiddleware: any;
// const dbService = new DatabaseService();
// 
// try {
//   cacheService = createCacheService(dbService);
//   await cacheService.initialize();
//   cacheMiddleware = new CacheMiddleware(cacheService);
//   console.log('✅ Cache service initialized');
// } catch (error) {
//   console.warn('⚠️ Cache service not available:', error instanceof Error ? error.message : String(error));
// }
// 
// try {
//   monitoringService = MonitoringService;
//   console.log('✅ Monitoring service initialized');
// } catch (error) {
//   console.warn('⚠️ Monitoring service not available:', error instanceof Error ? error.message : String(error));
// }

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "http://localhost:8080", "ws://localhost:8080"],
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
    'http://localhost:3001',
    'http://localhost:5173',
    'https://sharedwealth.net',
    'https://www.sharedwealth.net'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token']
}));

// Session configuration for CSRF protection
app.use(session({
  secret: process.env.SESSION_SECRET || 'wealth-pioneers-session-secret-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
  },
  name: 'wealth-pioneers-session'
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input validation and sanitization middleware
app.use(InputValidation.sanitizeRequest);
app.use(InputValidation.validateRequestSize(10 * 1024 * 1024)); // 10MB limit

// CSRF protection middleware (temporarily disabled for API endpoints)
// app.use(csrfProtection.middleware());

// Phase 2 middleware (commented out for now - will be enabled after Redis setup)
// app.use(httpsMiddleware.enforceHTTPS());
// app.use(httpsMiddleware.configureSSL());
// app.use(httpsMiddleware.validateCertificate());
// 
// if (monitoringService) {
//   app.use((req, res, next) => {
//     monitoringService.recordRequest(req, res);
//     next();
//   });
// }
// 
// if (cacheMiddleware) {
//   app.use('/api/companies', cacheMiddleware.cacheGet({ ttl: 300 }));
//   app.use('/api/admin/stats', cacheMiddleware.cacheAdminData({ ttl: 600 }));
//   app.use('/api/users/profile', cacheMiddleware.cacheUserData({ ttl: 1800 }));
// }

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
const distPath = path.join(process.cwd(), 'dist');
console.log('📁 Static files path:', distPath);
console.log('📁 Current working directory:', process.cwd());

// Check if dist directory exists
import fs from 'fs';
if (fs.existsSync(distPath)) {
  console.log('✅ dist directory exists');
  const files = fs.readdirSync(distPath);
  console.log('📄 Files in dist:', files);
} else {
  console.log('❌ dist directory does not exist');
}

app.use(express.static(distPath));

// Root route - serve the React app
app.get('/', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  console.log('🏠 Serving index.html from:', indexPath);
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('index.html not found');
  }
});

// Health and monitoring endpoints
app.use('/api/health', healthRoutes);

// CSRF token endpoint
app.get('/api/csrf-token', csrfProtection.tokenEndpoint());

// Phase 2 endpoints (commented out for now - will be enabled after Redis setup)
// Monitoring endpoints
// Cache management endpoints

// API routes
console.log('🔧 Registering API routes...');
app.use('/api/auth', authRoutes);
console.log('✅ /api/auth route registered');
app.use('/api/users', userRoutes);
console.log('✅ /api/users route registered');
app.use('/api/companies', companyRoutes);
console.log('✅ /api/companies route registered');
app.use('/api/admin', adminRoutes);
console.log('✅ /api/admin route registered');
app.use('/api/admin/content', contentRoutes);
console.log('✅ /api/admin/content route registered');
app.use('/api/admin/monitoring', monitoringRoutes);
console.log('✅ /api/admin/monitoring route registered');
app.use('/api/admin/funding', fundingRoutes);
console.log('✅ /api/admin/funding route registered');
app.use('/api/files', fileRoutes);
console.log('✅ /api/files route registered');
app.use('/api/email', emailRoutes);
console.log('✅ /api/email route registered');
app.use('/api/realtime', realtimeRoutes);
console.log('✅ /api/realtime route registered');
app.use('/api/dashboard', dashboardRoutes);
console.log('✅ /api/dashboard route registered');
app.use('/api/reactions', reactionsRoutes);
console.log('✅ /api/reactions route registered');
app.use('/api/connections', connectionsRoutes);
console.log('✅ /api/connections route registered');
app.use('/api/sharing', sharingRoutes);
console.log('✅ /api/sharing route registered');
app.use('/api', companyNewsRoutes);
console.log('✅ /api companyNews route registered');
app.use('/api/content', unifiedContentRoutes);
console.log('✅ /api/content route registered');
app.use('/api/social', unifiedSocialRoutes);
console.log('✅ /api/social route registered');
app.use('/api/dashboard', unifiedDashboardRoutes);
console.log('✅ /api/dashboard unified route registered');
app.use('/api/files', unifiedFileRoutes);
console.log('✅ /api/files unified route registered');
app.use('/api/users', unifiedUserRoutes);
console.log('✅ /api/users unified route registered');
app.use('/api/users', userProfileRoutes);
console.log('✅ /api/users profile route registered');
app.use('/api/networks', networkRoutes);
console.log('✅ /api/networks route registered');
app.use('/api/setup', setupRoutes);
console.log('✅ /api/setup route registered');
app.use('/api/fix', fixRoutes);
console.log('✅ /api/fix route registered');
console.log('🎉 All API routes registered successfully');

// Catch all handler - serve React app for client-side routing
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  console.log('🔄 Catch-all route triggered for:', req.path);
  console.log('🏠 Serving index.html from:', indexPath);
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('index.html not found');
  }
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
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

export default app;
