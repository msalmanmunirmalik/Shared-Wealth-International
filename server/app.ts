import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import companyRoutes from './routes/companies.js';
import adminRoutes from './routes/admin.js';
import healthRoutes from './routes/health.js';
import { requestLogger, errorLogger, performanceLogger } from './middleware/logger.js';
import { performanceMonitor } from './middleware/monitoring.js';
import { healthCheckLimiter } from './middleware/rateLimit.js';
import { setupSwagger } from './swagger.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('❌ CRITICAL: JWT_SECRET environment variable is not set!');
  process.exit(1);
}

const app: Application = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:8080', 'http://localhost:8081'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging and monitoring middleware
app.use(requestLogger);
app.use(performanceLogger);
app.use(performanceMonitor);

// API documentation
setupSwagger(app as any);

// Root route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Shared Wealth International API</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
        .endpoint { background: #ecf0f1; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #3498db; }
        .endpoint a { color: #2980b9; text-decoration: none; font-weight: bold; }
        .endpoint a:hover { text-decoration: underline; }
        .status { background: #d5f4e6; color: #27ae60; padding: 10px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 Shared Wealth International API</h1>
        <div class="status">✅ Server is running successfully on port 8080</div>
        <h2>Available Endpoints:</h2>
        <div class="endpoint">
          <strong>Health Check:</strong> <a href="/api/health" target="_blank">/api/health</a>
        </div>
        <div class="endpoint">
          <strong>API Documentation:</strong> <a href="/api-docs" target="_blank">/api-docs</a>
        </div>
        <div class="endpoint">
          <strong>Authentication:</strong> <a href="/api/auth" target="_blank">/api/auth</a>
        </div>
        <div class="endpoint">
          <strong>Users:</strong> <a href="/api/users" target="_blank">/api/users</a>
        </div>
        <div class="endpoint">
          <strong>Companies:</strong> <a href="/api/companies" target="_blank">/api/companies</a>
        </div>
        <div class="endpoint">
          <strong>Admin:</strong> <a href="/api/admin" target="_blank">/api/admin</a>
        </div>
        <p><em>Click any endpoint to test the API functionality.</em></p>
      </div>
    </body>
    </html>
  `);
});

// Health and monitoring endpoints
app.use('/api/health', healthRoutes);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    error: 'Not Found'
  });
});

// Error handling middleware
app.use(errorLogger);
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', error);
  
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? 'Something went wrong' : error.message
  });
});

export default app;
