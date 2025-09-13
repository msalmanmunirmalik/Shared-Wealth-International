import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

// Initialize Sentry
export const initSentry = (app: any) => {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    integrations: [
      // Enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // Enable Express.js tracing
      new Sentry.Integrations.Express({ app }),
      // Enable profiling
      nodeProfilingIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    // Profiling
    profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    // Set sample rate for error events
    sampleRate: 1.0,
    // Capture unhandled promise rejections
    captureUnhandledRejections: true,
    // Capture uncaught exceptions
    captureUncaughtException: true,
    // Custom tags
    initialScope: {
      tags: {
        component: 'backend',
        version: process.env.npm_package_version || '1.0.0',
      },
    },
  });

  console.log('🔍 Sentry initialized for monitoring');
};

// Sentry middleware for Express
export const sentryMiddleware = {
  // Request handler
  requestHandler: Sentry.requestHandler(),
  
  // Tracing handler
  tracingHandler: Sentry.tracingHandler(),
  
  // Error handler
  errorHandler: Sentry.errorHandler({
    shouldHandleError(error) {
      // Don't capture 404s and other client errors
      if (error.status && error.status < 500) {
        return false;
      }
      return true;
    },
  }),
};

// Custom error reporting
export const reportError = (error: Error, context?: any) => {
  Sentry.withScope((scope) => {
    if (context) {
      scope.setContext('additional_info', context);
    }
    Sentry.captureException(error);
  });
};

// Custom message reporting
export const reportMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info', context?: any) => {
  Sentry.withScope((scope) => {
    scope.setLevel(level as any);
    if (context) {
      scope.setContext('additional_info', context);
    }
    Sentry.captureMessage(message);
  });
};

// Performance monitoring
export const startTransaction = (name: string, op: string = 'custom') => {
  return Sentry.startTransaction({ name, op });
};

// User context
export const setUserContext = (user: any) => {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    role: user.role,
  });
};

// Breadcrumb logging
export const addBreadcrumb = (message: string, category: string = 'custom', level: 'info' | 'warning' | 'error' = 'info') => {
  Sentry.addBreadcrumb({
    message,
    category,
    level: level as any,
    timestamp: Date.now() / 1000,
  });
};

// Database query monitoring
export const monitorDatabaseQuery = (query: string, duration: number, error?: Error) => {
  if (error) {
    reportError(error, { query, duration });
  } else if (duration > 1000) { // Log slow queries (>1s)
    reportMessage(`Slow database query detected: ${duration}ms`, 'warning', { query, duration });
  }
};

// API endpoint monitoring
export const monitorApiEndpoint = (method: string, path: string, duration: number, statusCode: number, error?: Error) => {
  const context = {
    method,
    path,
    duration,
    statusCode,
  };

  if (error) {
    reportError(error, context);
  } else if (duration > 5000) { // Log slow endpoints (>5s)
    reportMessage(`Slow API endpoint: ${method} ${path}`, 'warning', context);
  } else if (statusCode >= 500) {
    reportMessage(`Server error: ${method} ${path}`, 'error', context);
  }
};

// Memory usage monitoring
export const monitorMemoryUsage = () => {
  const usage = process.memoryUsage();
  const memoryUsageMB = {
    rss: Math.round(usage.rss / 1024 / 1024),
    heapTotal: Math.round(usage.heapTotal / 1024 / 1024),
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024),
    external: Math.round(usage.external / 1024 / 1024),
  };

  // Report if memory usage is high
  if (memoryUsageMB.heapUsed > 500) { // >500MB
    reportMessage('High memory usage detected', 'warning', memoryUsageMB);
  }

  return memoryUsageMB;
};

// Custom performance metrics
export const trackCustomMetric = (name: string, value: number, tags?: Record<string, string>) => {
  Sentry.addBreadcrumb({
    message: `Custom metric: ${name} = ${value}`,
    category: 'metric',
    level: 'info',
    data: { name, value, tags },
  });
};

// Health check monitoring
export const monitorHealthCheck = (status: 'healthy' | 'unhealthy', details?: any) => {
  if (status === 'unhealthy') {
    reportMessage('Health check failed', 'error', details);
  } else {
    addBreadcrumb('Health check passed', 'health');
  }
};

export default Sentry;
