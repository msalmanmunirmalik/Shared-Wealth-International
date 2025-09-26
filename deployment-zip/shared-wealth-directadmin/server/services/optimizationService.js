import { DatabaseService } from '../../src/integrations/postgresql/database.js';
class CacheService {
    constructor() {
        this.cache = new Map();
        this.DEFAULT_TTL = 300000;
    }
    set(key, data, ttl = this.DEFAULT_TTL) {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl
        });
    }
    get(key) {
        const entry = this.cache.get(key);
        if (!entry)
            return null;
        const now = Date.now();
        if (now - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            return null;
        }
        return entry.data;
    }
    delete(key) {
        this.cache.delete(key);
    }
    clear() {
        this.cache.clear();
    }
    cleanup() {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp > entry.ttl) {
                this.cache.delete(key);
            }
        }
    }
    getStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }
}
class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
    }
    startTimer(operation) {
        const startTime = Date.now();
        return () => {
            const duration = Date.now() - startTime;
            this.recordMetric(operation, duration);
        };
    }
    recordMetric(operation, duration) {
        const existing = this.metrics.get(operation) || { count: 0, totalTime: 0, avgTime: 0 };
        existing.count++;
        existing.totalTime += duration;
        existing.avgTime = existing.totalTime / existing.count;
        this.metrics.set(operation, existing);
    }
    getMetrics() {
        const result = {};
        for (const [key, value] of this.metrics.entries()) {
            result[key] = value;
        }
        return result;
    }
    reset() {
        this.metrics.clear();
    }
}
class DatabaseOptimizer {
    constructor() {
        this.queryCache = new CacheService();
        this.performanceMonitor = new PerformanceMonitor();
    }
    async optimizedQuery(query, params = [], cacheKey, ttl = 300000) {
        const endTimer = this.performanceMonitor.startTimer('database_query');
        try {
            if (cacheKey) {
                const cached = this.queryCache.get(cacheKey);
                if (cached) {
                    return cached;
                }
            }
            const result = await DatabaseService.query(query, params);
            const data = result.rows;
            if (cacheKey) {
                this.queryCache.set(cacheKey, data, ttl);
            }
            return data;
        }
        finally {
            endTimer();
        }
    }
    async optimizedFindById(table, id, cacheKey, ttl = 300000) {
        const endTimer = this.performanceMonitor.startTimer('database_find_by_id');
        try {
            if (cacheKey) {
                const cached = this.queryCache.get(cacheKey);
                if (cached) {
                    return cached;
                }
            }
            const result = await DatabaseService.findById(table, id);
            const data = result.length > 0 ? result[0] : null;
            if (cacheKey && data) {
                this.queryCache.set(cacheKey, data, ttl);
            }
            return data;
        }
        finally {
            endTimer();
        }
    }
    async optimizedFindAll(table, filters = {}, cacheKey, ttl = 300000) {
        const endTimer = this.performanceMonitor.startTimer('database_find_all');
        try {
            if (cacheKey) {
                const cached = this.queryCache.get(cacheKey);
                if (cached) {
                    return cached;
                }
            }
            const result = await DatabaseService.findAll(table, filters);
            const data = result;
            if (cacheKey) {
                this.queryCache.set(cacheKey, data, ttl);
            }
            return data;
        }
        finally {
            endTimer();
        }
    }
    invalidateCache(pattern) {
        const stats = this.queryCache.getStats();
        for (const key of stats.keys) {
            if (key.includes(pattern)) {
                this.queryCache.delete(key);
            }
        }
    }
    getPerformanceMetrics() {
        return this.performanceMonitor.getMetrics();
    }
    getCacheStats() {
        return this.queryCache.getStats();
    }
    cleanupCache() {
        this.queryCache.cleanup();
    }
}
export const cacheService = new CacheService();
export const performanceMonitor = new PerformanceMonitor();
export const databaseOptimizer = new DatabaseOptimizer();
export const cacheMiddleware = (ttl = 300000) => {
    return (req, res, next) => {
        if (req.method !== 'GET') {
            return next();
        }
        const cacheKey = `api:${req.originalUrl}:${JSON.stringify(req.query)}`;
        const cached = cacheService.get(cacheKey);
        if (cached) {
            return res.json(cached);
        }
        const originalJson = res.json;
        res.json = function (data) {
            cacheService.set(cacheKey, data, ttl);
            return originalJson.call(this, data);
        };
        next();
    };
};
export const performanceMiddleware = (req, res, next) => {
    const endTimer = performanceMonitor.startTimer(`${req.method}:${req.route?.path || req.path}`);
    res.on('finish', () => {
        endTimer();
    });
    next();
};
export const databaseOptimizationMiddleware = (req, res, next) => {
    req.dbOptimizer = databaseOptimizer;
    next();
};
export const getHealthCheck = async (req, res) => {
    try {
        const dbMetrics = databaseOptimizer.getPerformanceMetrics();
        const cacheStats = databaseOptimizer.getCacheStats();
        const apiMetrics = performanceMonitor.getMetrics();
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
    }
    catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
setInterval(() => {
    databaseOptimizer.cleanupCache();
}, 300000);
export const optimizationUtils = {
    getUserCacheKey: (userId, resource, params) => {
        const paramStr = params ? JSON.stringify(params) : '';
        return `user:${userId}:${resource}:${paramStr}`;
    },
    getCompanyCacheKey: (companyId, resource, params) => {
        const paramStr = params ? JSON.stringify(params) : '';
        return `company:${companyId}:${resource}:${paramStr}`;
    },
    getGlobalCacheKey: (resource, params) => {
        const paramStr = params ? JSON.stringify(params) : '';
        return `global:${resource}:${paramStr}`;
    },
    TTL: {
        SHORT: 60000,
        MEDIUM: 300000,
        LONG: 1800000,
        VERY_LONG: 3600000
    }
};
//# sourceMappingURL=optimizationService.js.map