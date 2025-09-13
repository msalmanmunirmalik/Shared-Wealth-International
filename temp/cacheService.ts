import Redis from 'ioredis';
import { promisify } from 'util';

// Redis configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
  lazyConnect: true,
  connectTimeout: 10000,
  commandTimeout: 5000,
};

// Create Redis client
const redis = new Redis(redisConfig);

// Redis event handlers
redis.on('connect', () => {
  console.log('🔗 Redis connected');
});

redis.on('ready', () => {
  console.log('✅ Redis ready');
});

redis.on('error', (error) => {
  console.error('❌ Redis error:', error);
});

redis.on('close', () => {
  console.log('🔌 Redis connection closed');
});

redis.on('reconnecting', () => {
  console.log('🔄 Redis reconnecting...');
});

// Cache service class
export class CacheService {
  private static instance: CacheService;
  private redis: Redis;

  constructor() {
    this.redis = redis;
  }

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  // Basic cache operations
  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      if (ttl) {
        await this.redis.setex(key, ttl, serializedValue);
      } else {
        await this.redis.set(key, serializedValue);
      }
    } catch (error) {
      console.error('Cache set error:', error);
      throw error;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      if (value) {
        return JSON.parse(value);
      }
      return null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  async expire(key: string, ttl: number): Promise<void> {
    try {
      await this.redis.expire(key, ttl);
    } catch (error) {
      console.error('Cache expire error:', error);
    }
  }

  // Hash operations
  async hset(key: string, field: string, value: any): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      await this.redis.hset(key, field, serializedValue);
    } catch (error) {
      console.error('Cache hset error:', error);
    }
  }

  async hget<T>(key: string, field: string): Promise<T | null> {
    try {
      const value = await this.redis.hget(key, field);
      if (value) {
        return JSON.parse(value);
      }
      return null;
    } catch (error) {
      console.error('Cache hget error:', error);
      return null;
    }
  }

  async hgetall<T>(key: string): Promise<Record<string, T> | null> {
    try {
      const hash = await this.redis.hgetall(key);
      if (Object.keys(hash).length === 0) {
        return null;
      }
      
      const result: Record<string, T> = {};
      for (const [field, value] of Object.entries(hash)) {
        result[field] = JSON.parse(value as string);
      }
      return result;
    } catch (error) {
      console.error('Cache hgetall error:', error);
      return null;
    }
  }

  async hdel(key: string, field: string): Promise<void> {
    try {
      await this.redis.hdel(key, field);
    } catch (error) {
      console.error('Cache hdel error:', error);
    }
  }

  // List operations
  async lpush(key: string, ...values: any[]): Promise<void> {
    try {
      const serializedValues = values.map(v => JSON.stringify(v));
      await this.redis.lpush(key, ...serializedValues);
    } catch (error) {
      console.error('Cache lpush error:', error);
    }
  }

  async rpush(key: string, ...values: any[]): Promise<void> {
    try {
      const serializedValues = values.map(v => JSON.stringify(v));
      await this.redis.rpush(key, ...serializedValues);
    } catch (error) {
      console.error('Cache rpush error:', error);
    }
  }

  async lrange<T>(key: string, start: number, stop: number): Promise<T[]> {
    try {
      const values = await this.redis.lrange(key, start, stop);
      return values.map(v => JSON.parse(v));
    } catch (error) {
      console.error('Cache lrange error:', error);
      return [];
    }
  }

  async llen(key: string): Promise<number> {
    try {
      return await this.redis.llen(key);
    } catch (error) {
      console.error('Cache llen error:', error);
      return 0;
    }
  }

  // Set operations
  async sadd(key: string, ...members: any[]): Promise<void> {
    try {
      const serializedMembers = members.map(m => JSON.stringify(m));
      await this.redis.sadd(key, ...serializedMembers);
    } catch (error) {
      console.error('Cache sadd error:', error);
    }
  }

  async smembers<T>(key: string): Promise<T[]> {
    try {
      const members = await this.redis.smembers(key);
      return members.map(m => JSON.parse(m));
    } catch (error) {
      console.error('Cache smembers error:', error);
      return [];
    }
  }

  async sismember(key: string, member: any): Promise<boolean> {
    try {
      const serializedMember = JSON.stringify(member);
      const result = await this.redis.sismember(key, serializedMember);
      return result === 1;
    } catch (error) {
      console.error('Cache sismember error:', error);
      return false;
    }
  }

  // Pattern operations
  async keys(pattern: string): Promise<string[]> {
    try {
      return await this.redis.keys(pattern);
    } catch (error) {
      console.error('Cache keys error:', error);
      return [];
    }
  }

  async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      console.error('Cache delPattern error:', error);
    }
  }

  // Cache with fallback
  async getOrSet<T>(
    key: string,
    fallback: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    try {
      // Try to get from cache first
      const cached = await this.get<T>(key);
      if (cached !== null) {
        return cached;
      }

      // If not in cache, execute fallback
      const value = await fallback();
      
      // Store in cache
      await this.set(key, value, ttl);
      
      return value;
    } catch (error) {
      console.error('Cache getOrSet error:', error);
      // If cache fails, still try to execute fallback
      return await fallback();
    }
  }

  // Cache invalidation helpers
  async invalidateUserCache(userId: string): Promise<void> {
    const patterns = [
      `user:${userId}:*`,
      `session:${userId}:*`,
      `companies:user:${userId}:*`
    ];
    
    for (const pattern of patterns) {
      await this.delPattern(pattern);
    }
  }

  async invalidateCompanyCache(companyId: string): Promise<void> {
    const patterns = [
      `company:${companyId}:*`,
      `companies:*`,
      `network:*`
    ];
    
    for (const pattern of patterns) {
      await this.delPattern(pattern);
    }
  }

  // Session management
  async setSession(sessionId: string, sessionData: any, ttl: number = 3600): Promise<void> {
    await this.set(`session:${sessionId}`, sessionData, ttl);
  }

  async getSession<T>(sessionId: string): Promise<T | null> {
    return await this.get<T>(`session:${sessionId}`);
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.del(`session:${sessionId}`);
  }

  // Rate limiting
  async checkRateLimit(key: string, limit: number, window: number): Promise<boolean> {
    try {
      const current = await this.redis.incr(key);
      if (current === 1) {
        await this.redis.expire(key, window);
      }
      return current <= limit;
    } catch (error) {
      console.error('Rate limit check error:', error);
      return true; // Allow on error
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.redis.ping();
      return result === 'PONG';
    } catch (error) {
      console.error('Redis health check failed:', error);
      return false;
    }
  }

  // Get Redis info
  async getInfo(): Promise<any> {
    try {
      return await this.redis.info();
    } catch (error) {
      console.error('Redis info error:', error);
      return null;
    }
  }

  // Close connection
  async close(): Promise<void> {
    try {
      await this.redis.quit();
    } catch (error) {
      console.error('Redis close error:', error);
    }
  }
}

// Export singleton instance
export const cache = CacheService.getInstance();

// Cache middleware for Express
export const cacheMiddleware = (ttl: number = 300, keyGenerator?: (req: any) => string) => {
  return async (req: any, res: any, next: any) => {
    try {
      const key = keyGenerator ? keyGenerator(req) : `cache:${req.method}:${req.url}`;
      
      // Try to get from cache
      const cached = await cache.get(key);
      if (cached) {
        res.json(cached);
        return;
      }

      // Store original json method
      const originalJson = res.json;
      
      // Override json method to cache response
      res.json = function(data: any) {
        // Cache the response
        cache.set(key, data, ttl).catch(error => {
          console.error('Cache set error in middleware:', error);
        });
        
        // Call original json method
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

export default cache;
