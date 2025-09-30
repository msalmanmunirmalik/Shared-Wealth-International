import { Request, Response, NextFunction } from 'express';
import { DatabaseService } from '../../src/integrations/postgresql/database.js';

// Cache interface
interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

// In-memory cache (in production, use Redis)
class CacheService {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly DEFAULT_TTL = 300000; // 5 minutes

  set(key: string, data: any, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache statistics
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Performance monitoring
class PerformanceMonitor {
  private metrics: Map<string, { count: number; totalTime: number; avgTime: number }> = new Map();

  startTimer(operation: string): () => void {
    const startTime = Date.now();
    return () => {
      const duration = Date.now() - startTime;
      this.recordMetric(operation, duration);
    };
  }

  recordMetric(operation: string, duration: number): void {
    const existing = this.metrics.get(operation) || { count: 0, totalTime: 0, avgTime: 0 };
    existing.count++;
    existing.totalTime += duration;
    existing.avgTime = existing.totalTime / existing.count;
    this.metrics.set(operation, existing);
  }

  getMetrics(): Record<string, { count: number; totalTime: number; avgTime: number }> {
    const result: Record<string, { count: number; totalTime: number; avgTime: number }> = {};
    for (const [key, value] of this.metrics.entries()) {
      result[key] = value;
    }
    return result;
  }

  reset(): void {
    this.metrics.clear();
  }
}

// Database query optimization
class DatabaseOptimizer {
  private queryCache: CacheService;
  private performanceMonitor: PerformanceMonitor;

  constructor() {
    this.queryCache = new CacheService();
    this.performanceMonitor = new PerformanceMonitor();
  }

  async optimizedQuery<T>(
    query: string,
    params: any[] = [],
    cacheKey?: string,
    ttl: number = 300000
  ): Promise<T[]> {
    const endTimer = this.performanceMonitor.startTimer('database_query');

    try {
      // Check cache first
      if (cacheKey) {
        const cached = this.queryCache.get(cacheKey);
        if (cached) {
          return cached;
        }
      }

      // Execute query
      const result = await DatabaseService.query(query, params);
      const data = result.rows;

      // Cache result
      if (cacheKey) {
        this.queryCache.set(cacheKey, data, ttl);
      }

      return data;
    } finally {
      endTimer();
    }
  }

  async optimizedFindById<T>(
    table: string,
    id: string,
    cacheKey?: string,
    ttl: number = 300000
  ): Promise<T | null> {
    const endTimer = this.performanceMonitor.startTimer('database_find_by_id');

    try {
      // Check cache first
      if (cacheKey) {
        const cached = this.queryCache.get(cacheKey);
        if (cached) {
          return cached;
        }
      }

      // Execute query
      const result = await DatabaseService.findById(table, id);
      const data = result.length > 0 ? result[0] : null;

      // Cache result
      if (cacheKey && data) {
        this.queryCache.set(cacheKey, data, ttl);
      }

      return data;
    } finally {
      endTimer();
    }
  }

  async optimizedFindAll<T>(
    table: string,
    filters: any = {},
    cacheKey?: string,
    ttl: number = 300000
  ): Promise<T[]> {
    const endTimer = this.performanceMonitor.startTimer('database_find_all');

    try {
      // Check cache first
      if (cacheKey) {
        const cached = this.queryCache.get(cacheKey);
        if (cached) {
          return cached;
        }
      }

      // Execute query
      const result = await DatabaseService.findAll(table, filters);
      const data = result;

      // Cache result
      if (cacheKey) {
        this.queryCache.set(cacheKey, data, ttl);
      }

      return data;
    } finally {
      endTimer();
    }
  }

  // Invalidate cache entries
  invalidateCache(pattern: string): void {
    const stats = this.queryCache.getStats();
    for (const key of stats.keys) {
      if (key.includes(pattern)) {
        this.queryCache.delete(key);
      }
    }
  }

  // Get performance metrics
  getPerformanceMetrics(): Record<string, { count: number; totalTime: number; avgTime: number }> {
    return this.performanceMonitor.getMetrics();
  }

  // Get cache statistics
  getCacheStats(): { size: number; keys: string[] } {
    return this.queryCache.getStats();
  }

  // Cleanup expired cache entries
  cleanupCache(): void {
    this.queryCache.cleanup();
  }
}

// Global instances
export const cacheService = new CacheService();
export const performanceMonitor = new PerformanceMonitor();
export const databaseOptimizer = new DatabaseOptimizer();

// Middleware for caching API responses
export const cacheMiddleware = (ttl: number = 300000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const cacheKey = `api:${req.originalUrl}:${JSON.stringify(req.query)}`;
    const cached = cacheService.get(cacheKey);

    if (cached) {
      return res.json(cached);
    }

    // Store original res.json
    const originalJson = res.json;
    res.json = function(data: any) {
      // Cache the response
      cacheService.set(cacheKey, data, ttl);
      return originalJson.call(this, data);
    };

    next();
  };
};

// Middleware for performance monitoring
export const performanceMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const endTimer = performanceMonitor.startTimer(`${req.method}:${req.route?.path || req.path}`);
  
  res.on('finish', () => {
    endTimer();
  });

  next();
};

// Middleware for database query optimization
export const databaseOptimizationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Add database optimizer to request object
  (req as any).dbOptimizer = databaseOptimizer;
  next();
};

// Health check endpoint with performance metrics
export const getHealthCheck = async (req: Request, res: Response) => {
  try {
    const dbMetrics = databaseOptimizer.getPerformanceMetrics();
    const cacheStats = databaseOptimizer.getCacheStats();
    const apiMetrics = performanceMonitor.getMetrics();

    // Test database connection
    const dbTest = await DatabaseService.query('SELECT 1 as test');
    const dbHealthy = dbTest.rows.length > 0;

    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        connected: dbHealthy,
        metrics: dbMetrics
      },
      cache: cacheStats,
      api: apiMetrics,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0'
    };

    res.json(health);
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Cleanup expired cache entries every 5 minutes
setInterval(() => {
  databaseOptimizer.cleanupCache();
}, 300000);

// Export optimization utilities
export const optimizationUtils = {
  // Generate cache key for user-specific data
  getUserCacheKey: (userId: string, resource: string, params?: any): string => {
    const paramStr = params ? JSON.stringify(params) : '';
    return `user:${userId}:${resource}:${paramStr}`;
  },

  // Generate cache key for company-specific data
  getCompanyCacheKey: (companyId: string, resource: string, params?: any): string => {
    const paramStr = params ? JSON.stringify(params) : '';
    return `company:${companyId}:${resource}:${paramStr}`;
  },

  // Generate cache key for global data
  getGlobalCacheKey: (resource: string, params?: any): string => {
    const paramStr = params ? JSON.stringify(params) : '';
    return `global:${resource}:${paramStr}`;
  },

  // Cache TTL constants
  TTL: {
    SHORT: 60000,      // 1 minute
    MEDIUM: 300000,    // 5 minutes
    LONG: 1800000,     // 30 minutes
    VERY_LONG: 3600000 // 1 hour
  }
};
