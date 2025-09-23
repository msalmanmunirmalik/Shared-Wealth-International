import Redis from 'ioredis';
import { DatabaseService } from './databaseService.js';

export interface CacheConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  retryDelayOnFailover?: number;
  maxRetriesPerRequest?: number;
  lazyConnect?: boolean;
}

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  prefix?: string;
  serialize?: boolean;
}

export class CacheService {
  private redis: Redis;
  private db: DatabaseService;
  private isConnected: boolean = false;
  private defaultTTL: number = 3600; // 1 hour

  constructor(config: CacheConfig, db: DatabaseService) {
    this.redis = new Redis({
      host: config.host,
      port: config.port,
      password: config.password,
      db: config.db || 0,
      retryDelayOnFailover: config.retryDelayOnFailover || 100,
      maxRetriesPerRequest: config.maxRetriesPerRequest || 3,
      lazyConnect: config.lazyConnect || true,
      connectTimeout: 10000,
      commandTimeout: 5000,
    });

    this.db = db;

    // Event handlers
    this.redis.on('connect', () => {
      console.log('✅ Redis connected successfully');
      this.isConnected = true;
    });

    this.redis.on('error', (error) => {
      console.error('❌ Redis connection error:', error);
      this.isConnected = false;
    });

    this.redis.on('close', () => {
      console.log('🔌 Redis connection closed');
      this.isConnected = false;
    });

    this.redis.on('reconnecting', () => {
      console.log('🔄 Redis reconnecting...');
    });
  }

  /**
   * Initialize Redis connection
   */
  async initialize(): Promise<void> {
    try {
      await this.redis.connect();
      console.log('✅ Cache service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize cache service:', error);
      throw error;
    }
  }

  /**
   * Check if Redis is connected
   */
  isReady(): boolean {
    return this.isConnected && this.redis.status === 'ready';
  }

  /**
   * Generate cache key with prefix
   */
  private generateKey(key: string, prefix?: string): string {
    const keyPrefix = prefix || 'wealth-pioneers';
    return `${keyPrefix}:${key}`;
  }

  /**
   * Serialize data for storage
   */
  private serialize(data: any): string {
    return JSON.stringify(data);
  }

  /**
   * Deserialize data from storage
   */
  private deserialize<T>(data: string): T {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('❌ Failed to deserialize cache data:', error);
      throw error;
    }
  }

  /**
   * Set a value in cache
   */
  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    if (!this.isReady()) {
      console.warn('⚠️ Cache not ready, skipping set operation');
      return;
    }

    try {
      const cacheKey = this.generateKey(key, options.prefix);
      const serializedValue = options.serialize !== false ? this.serialize(value) : value as string;
      const ttl = options.ttl || this.defaultTTL;

      if (ttl > 0) {
        await this.redis.setex(cacheKey, ttl, serializedValue);
      } else {
        await this.redis.set(cacheKey, serializedValue);
      }

      console.log(`✅ Cached: ${cacheKey} (TTL: ${ttl}s)`);
    } catch (error) {
      console.error(`❌ Failed to set cache key ${key}:`, error);
    }
  }

  /**
   * Get a value from cache
   */
  async get<T>(key: string, options: CacheOptions = {}): Promise<T | null> {
    if (!this.isReady()) {
      console.warn('⚠️ Cache not ready, returning null');
      return null;
    }

    try {
      const cacheKey = this.generateKey(key, options.prefix);
      const data = await this.redis.get(cacheKey);

      if (data === null) {
        return null;
      }

      return options.serialize !== false ? this.deserialize<T>(data) : data as T;
    } catch (error) {
      console.error(`❌ Failed to get cache key ${key}:`, error);
      return null;
    }
  }

  /**
   * Delete a value from cache
   */
  async delete(key: string, prefix?: string): Promise<void> {
    if (!this.isReady()) {
      console.warn('⚠️ Cache not ready, skipping delete operation');
      return;
    }

    try {
      const cacheKey = this.generateKey(key, prefix);
      await this.redis.del(cacheKey);
      console.log(`🗑️ Deleted cache key: ${cacheKey}`);
    } catch (error) {
      console.error(`❌ Failed to delete cache key ${key}:`, error);
    }
  }

  /**
   * Check if a key exists in cache
   */
  async exists(key: string, prefix?: string): Promise<boolean> {
    if (!this.isReady()) {
      return false;
    }

    try {
      const cacheKey = this.generateKey(key, prefix);
      const result = await this.redis.exists(cacheKey);
      return result === 1;
    } catch (error) {
      console.error(`❌ Failed to check existence of cache key ${key}:`, error);
      return false;
    }
  }

  /**
   * Set expiration for a key
   */
  async expire(key: string, ttl: number, prefix?: string): Promise<void> {
    if (!this.isReady()) {
      return;
    }

    try {
      const cacheKey = this.generateKey(key, prefix);
      await this.redis.expire(cacheKey, ttl);
    } catch (error) {
      console.error(`❌ Failed to set expiration for cache key ${key}:`, error);
    }
  }

  /**
   * Get or set pattern with database fallback
   */
  async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    // Try to get from cache first
    const cached = await this.get<T>(key, options);
    if (cached !== null) {
      console.log(`📦 Cache hit: ${key}`);
      return cached;
    }

    // Cache miss, fetch from database
    console.log(`🔄 Cache miss: ${key}, fetching from database`);
    try {
      const data = await fetchFn();
      
      // Store in cache
      await this.set(key, data, options);
      
      return data;
    } catch (error) {
      console.error(`❌ Failed to fetch data for cache key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Cache user data
   */
  async cacheUser(userId: string): Promise<void> {
    const user = await this.db.query(
      'SELECT id, email, first_name, last_name, role, is_active, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (user.rows.length > 0) {
      await this.set(`user:${userId}`, user.rows[0], { ttl: 1800 }); // 30 minutes
    }
  }

  /**
   * Get cached user data
   */
  async getCachedUser(userId: string): Promise<any | null> {
    return await this.get(`user:${userId}`);
  }

  /**
   * Cache company data
   */
  async cacheCompany(companyId: string): Promise<void> {
    const company = await this.db.query(`
      SELECT c.*, u.first_name, u.last_name, u.email as creator_email
      FROM companies c
      LEFT JOIN users u ON c.created_by = u.id
      WHERE c.id = $1
    `, [companyId]);

    if (company.rows.length > 0) {
      await this.set(`company:${companyId}`, company.rows[0], { ttl: 3600 }); // 1 hour
    }
  }

  /**
   * Get cached company data
   */
  async getCachedCompany(companyId: string): Promise<any | null> {
    return await this.get(`company:${companyId}`);
  }

  /**
   * Cache companies list
   */
  async cacheCompaniesList(filters: any = {}): Promise<void> {
    const query = `
      SELECT c.*, u.first_name, u.last_name, u.email as creator_email
      FROM companies c
      LEFT JOIN users u ON c.created_by = u.id
      WHERE c.status = $1
      ORDER BY c.created_at DESC
      LIMIT 100
    `;
    
    const companies = await this.db.query(query, ['approved']);
    
    const cacheKey = `companies:list:${JSON.stringify(filters)}`;
    await this.set(cacheKey, companies.rows, { ttl: 1800 }); // 30 minutes
  }

  /**
   * Get cached companies list
   */
  async getCachedCompaniesList(filters: any = {}): Promise<any[] | null> {
    const cacheKey = `companies:list:${JSON.stringify(filters)}`;
    return await this.get(cacheKey);
  }

  /**
   * Cache admin statistics
   */
  async cacheAdminStats(): Promise<void> {
    const stats = await this.db.query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE is_active = true) as total_users,
        (SELECT COUNT(*) FROM companies WHERE status = 'approved') as total_companies,
        (SELECT COUNT(*) FROM companies WHERE status = 'pending') as pending_companies,
        (SELECT COUNT(*) FROM news_articles WHERE status = 'published') as total_articles,
        (SELECT COUNT(*) FROM events WHERE status = 'active') as total_events
    `);

    if (stats.rows.length > 0) {
      await this.set('admin:stats', stats.rows[0], { ttl: 600 }); // 10 minutes
    }
  }

  /**
   * Get cached admin statistics
   */
  async getCachedAdminStats(): Promise<any | null> {
    return await this.get('admin:stats');
  }

  /**
   * Cache recent activities
   */
  async cacheRecentActivities(limit: number = 50): Promise<void> {
    const activities = await this.db.query(`
      SELECT af.*, u.first_name, u.last_name, u.email
      FROM activity_feed af
      LEFT JOIN users u ON af.user_id = u.id
      ORDER BY af.created_at DESC
      LIMIT $1
    `, [limit]);

    await this.set('activities:recent', activities.rows, { ttl: 300 }); // 5 minutes
  }

  /**
   * Get cached recent activities
   */
  async getCachedRecentActivities(): Promise<any[] | null> {
    return await this.get('activities:recent');
  }

  /**
   * Invalidate user-related cache
   */
  async invalidateUserCache(userId: string): Promise<void> {
    await this.delete(`user:${userId}`);
    await this.delete('admin:stats'); // Invalidate stats cache
  }

  /**
   * Invalidate company-related cache
   */
  async invalidateCompanyCache(companyId: string): Promise<void> {
    await this.delete(`company:${companyId}`);
    await this.delete('companies:list'); // Invalidate companies list
    await this.delete('admin:stats'); // Invalidate stats cache
  }

  /**
   * Invalidate all admin cache
   */
  async invalidateAdminCache(): Promise<void> {
    const keys = await this.redis.keys('admin:*');
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }

  /**
   * Clear all cache
   */
  async clearAll(): Promise<void> {
    if (!this.isReady()) {
      return;
    }

    try {
      await this.redis.flushdb();
      console.log('🗑️ All cache cleared');
    } catch (error) {
      console.error('❌ Failed to clear cache:', error);
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    connected: boolean;
    memory: any;
    info: any;
    keyspace: any;
  }> {
    if (!this.isReady()) {
      return {
        connected: false,
        memory: null,
        info: null,
        keyspace: null
      };
    }

    try {
      const info = await this.redis.info();
      const memory = await this.redis.memory('usage');
      const keyspace = await this.redis.info('keyspace');

      return {
        connected: true,
        memory: { usage: memory },
        info: this.parseRedisInfo(info),
        keyspace: this.parseRedisInfo(keyspace)
      };
    } catch (error) {
      console.error('❌ Failed to get cache stats:', error);
      return {
        connected: false,
        memory: null,
        info: null,
        keyspace: null
      };
    }
  }

  /**
   * Parse Redis info output
   */
  private parseRedisInfo(info: string): any {
    const lines = info.split('\r\n');
    const result: any = {};

    for (const line of lines) {
      if (line.includes(':')) {
        const [key, value] = line.split(':');
        result[key] = isNaN(Number(value)) ? value : Number(value);
      }
    }

    return result;
  }

  /**
   * Close Redis connection
   */
  async close(): Promise<void> {
    try {
      await this.redis.quit();
      console.log('🔌 Cache service closed');
    } catch (error) {
      console.error('❌ Error closing cache service:', error);
      this.redis.disconnect();
    }
  }
}

// Create cache service instance
export const createCacheService = (db: DatabaseService): CacheService => {
  const config: CacheConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0'),
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
    lazyConnect: true
  };

  return new CacheService(config, db);
};

export default CacheService;
