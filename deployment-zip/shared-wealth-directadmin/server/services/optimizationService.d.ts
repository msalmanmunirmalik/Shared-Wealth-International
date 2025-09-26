import { Request, Response, NextFunction } from 'express';
declare class CacheService {
    private cache;
    private readonly DEFAULT_TTL;
    set(key: string, data: any, ttl?: number): void;
    get(key: string): any | null;
    delete(key: string): void;
    clear(): void;
    cleanup(): void;
    getStats(): {
        size: number;
        keys: string[];
    };
}
declare class PerformanceMonitor {
    private metrics;
    startTimer(operation: string): () => void;
    recordMetric(operation: string, duration: number): void;
    getMetrics(): Record<string, {
        count: number;
        totalTime: number;
        avgTime: number;
    }>;
    reset(): void;
}
declare class DatabaseOptimizer {
    private queryCache;
    private performanceMonitor;
    constructor();
    optimizedQuery<T>(query: string, params?: any[], cacheKey?: string, ttl?: number): Promise<T[]>;
    optimizedFindById<T>(table: string, id: string, cacheKey?: string, ttl?: number): Promise<T | null>;
    optimizedFindAll<T>(table: string, filters?: any, cacheKey?: string, ttl?: number): Promise<T[]>;
    invalidateCache(pattern: string): void;
    getPerformanceMetrics(): Record<string, {
        count: number;
        totalTime: number;
        avgTime: number;
    }>;
    getCacheStats(): {
        size: number;
        keys: string[];
    };
    cleanupCache(): void;
}
export declare const cacheService: CacheService;
export declare const performanceMonitor: PerformanceMonitor;
export declare const databaseOptimizer: DatabaseOptimizer;
export declare const cacheMiddleware: (ttl?: number) => (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const performanceMiddleware: (req: Request, res: Response, next: NextFunction) => void;
export declare const databaseOptimizationMiddleware: (req: Request, res: Response, next: NextFunction) => void;
export declare const getHealthCheck: (req: Request, res: Response) => Promise<void>;
export declare const optimizationUtils: {
    getUserCacheKey: (userId: string, resource: string, params?: any) => string;
    getCompanyCacheKey: (companyId: string, resource: string, params?: any) => string;
    getGlobalCacheKey: (resource: string, params?: any) => string;
    TTL: {
        SHORT: number;
        MEDIUM: number;
        LONG: number;
        VERY_LONG: number;
    };
};
export {};
//# sourceMappingURL=optimizationService.d.ts.map