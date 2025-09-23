import { Request, Response, NextFunction } from 'express';
import { CacheService } from '../services/cacheService.js';

export interface CacheMiddlewareOptions {
  ttl?: number;
  keyGenerator?: (req: Request) => string;
  skipCache?: (req: Request) => boolean;
  invalidatePattern?: string[];
}

/**
 * Cache middleware for Express routes
 */
export class CacheMiddleware {
  private cacheService: CacheService;

  constructor(cacheService: CacheService) {
    this.cacheService = cacheService;
  }

  /**
   * Cache GET requests
   */
  cacheGet(options: CacheMiddlewareOptions = {}) {
    return async (req: Request, res: Response, next: NextFunction) => {
      // Only cache GET requests
      if (req.method !== 'GET') {
        return next();
      }

      // Skip cache if specified
      if (options.skipCache && options.skipCache(req)) {
        return next();
      }

      try {
        // Generate cache key
        const cacheKey = options.keyGenerator 
          ? options.keyGenerator(req) 
          : this.generateDefaultKey(req);

        // Try to get from cache
        const cachedData = await this.cacheService.get(cacheKey, {
          ttl: options.ttl || 300 // 5 minutes default
        });

        if (cachedData !== null) {
          console.log(`📦 Cache hit: ${cacheKey}`);
          return res.json({
            success: true,
            data: cachedData,
            cached: true,
            timestamp: new Date().toISOString()
          });
        }

        // Cache miss - continue to route handler
        console.log(`🔄 Cache miss: ${cacheKey}`);
        
        // Store original json method
        const originalJson = res.json.bind(res);
        
        // Override json method to cache response
        res.json = (body: any) => {
          // Cache the response data
          this.cacheService.set(cacheKey, body.data || body, {
            ttl: options.ttl || 300
          }).catch(error => {
            console.error('❌ Failed to cache response:', error);
          });

          return originalJson(body);
        };

        next();
      } catch (error) {
        console.error('❌ Cache middleware error:', error);
        next();
      }
    };
  }

  /**
   * Invalidate cache after POST/PUT/DELETE requests
   */
  invalidateCache(patterns: string[] = []) {
    return async (req: Request, res: Response, next: NextFunction) => {
      // Store original methods
      const originalJson = res.json.bind(res);
      const originalSend = res.send.bind(res);

      // Override response methods to invalidate cache
      res.json = (body: any) => {
        this.invalidateCachePatterns(patterns, req).catch(error => {
          console.error('❌ Failed to invalidate cache:', error);
        });
        return originalJson(body);
      };

      res.send = (body: any) => {
        this.invalidateCachePatterns(patterns, req).catch(error => {
          console.error('❌ Failed to invalidate cache:', error);
        });
        return originalSend(body);
      };

      next();
    };
  }

  /**
   * Generate default cache key from request
   */
  private generateDefaultKey(req: Request): string {
    const path = req.path;
    const query = JSON.stringify(req.query);
    const user = (req as any).user?.id || 'anonymous';
    
    return `api:${path}:${user}:${Buffer.from(query).toString('base64')}`;
  }

  /**
   * Invalidate cache patterns
   */
  private async invalidateCachePatterns(patterns: string[], req: Request): Promise<void> {
    try {
      for (const pattern of patterns) {
        let cacheKey = pattern;

        // Replace placeholders with actual values
        if (pattern.includes('{userId}') && (req as any).user?.id) {
          cacheKey = cacheKey.replace('{userId}', (req as any).user.id);
        }

        if (pattern.includes('{companyId}') && req.params?.id) {
          cacheKey = cacheKey.replace('{companyId}', req.params.id);
        }

        if (pattern.includes('{path}')) {
          cacheKey = cacheKey.replace('{path}', req.path);
        }

        // Delete specific key or pattern
        if (cacheKey.includes('*')) {
          // Handle wildcard patterns
          await this.cacheService.redis.keys(cacheKey).then(keys => {
            if (keys.length > 0) {
              return this.cacheService.redis.del(...keys);
            }
          });
        } else {
          await this.cacheService.delete(cacheKey);
        }

        console.log(`🗑️ Invalidated cache: ${cacheKey}`);
      }
    } catch (error) {
      console.error('❌ Error invalidating cache patterns:', error);
    }
  }

  /**
   * Cache user-specific data
   */
  cacheUserData(options: CacheMiddlewareOptions = {}) {
    return async (req: Request, res: Response, next: NextFunction) => {
      if (req.method !== 'GET' || !(req as any).user?.id) {
        return next();
      }

      try {
        const userId = (req as any).user.id;
        const cacheKey = `user:${userId}:${req.path}`;

        const cachedData = await this.cacheService.get(cacheKey, {
          ttl: options.ttl || 600 // 10 minutes default
        });

        if (cachedData !== null) {
          console.log(`📦 User cache hit: ${cacheKey}`);
          return res.json({
            success: true,
            data: cachedData,
            cached: true,
            timestamp: new Date().toISOString()
          });
        }

        // Override response to cache user data
        const originalJson = res.json.bind(res);
        res.json = (body: any) => {
          this.cacheService.set(cacheKey, body.data || body, {
            ttl: options.ttl || 600
          }).catch(error => {
            console.error('❌ Failed to cache user data:', error);
          });

          return originalJson(body);
        };

        next();
      } catch (error) {
        console.error('❌ User cache middleware error:', error);
        next();
      }
    };
  }

  /**
   * Cache admin data
   */
  cacheAdminData(options: CacheMiddlewareOptions = {}) {
    return async (req: Request, res: Response, next: NextFunction) => {
      if (req.method !== 'GET') {
        return next();
      }

      try {
        const cacheKey = `admin:${req.path}`;

        const cachedData = await this.cacheService.get(cacheKey, {
          ttl: options.ttl || 300 // 5 minutes default
        });

        if (cachedData !== null) {
          console.log(`📦 Admin cache hit: ${cacheKey}`);
          return res.json({
            success: true,
            data: cachedData,
            cached: true,
            timestamp: new Date().toISOString()
          });
        }

        // Override response to cache admin data
        const originalJson = res.json.bind(res);
        res.json = (body: any) => {
          this.cacheService.set(cacheKey, body.data || body, {
            ttl: options.ttl || 300
          }).catch(error => {
            console.error('❌ Failed to cache admin data:', error);
          });

          return originalJson(body);
        };

        next();
      } catch (error) {
        console.error('❌ Admin cache middleware error:', error);
        next();
      }
    };
  }
}

export default CacheMiddleware;
