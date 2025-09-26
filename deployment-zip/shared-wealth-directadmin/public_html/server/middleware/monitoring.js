import { performance } from 'perf_hooks';
const metrics = {
    requestCount: 0,
    errorCount: 0,
    totalResponseTime: 0,
    slowRequestCount: 0,
    startTime: Date.now()
};
export const performanceMonitor = (req, res, next) => {
    const startTime = performance.now();
    metrics.requestCount++;
    res.on('finish', () => {
        const duration = performance.now() - startTime;
        metrics.totalResponseTime += duration;
        if (duration > 500) {
            metrics.slowRequestCount++;
        }
        if (!res.headersSent) {
            res.setHeader('X-Response-Time', `${duration.toFixed(2)}ms`);
        }
    });
    res.on('error', () => {
        metrics.errorCount++;
    });
    next();
};
export const healthCheck = (req, res) => {
    const uptime = Date.now() - metrics.startTime;
    const avgResponseTime = metrics.requestCount > 0
        ? metrics.totalResponseTime / metrics.requestCount
        : 0;
    const healthData = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor(uptime / 1000)}s`,
        metrics: {
            totalRequests: metrics.requestCount,
            totalErrors: metrics.errorCount,
            averageResponseTime: `${avgResponseTime.toFixed(2)}ms`,
            slowRequestPercentage: metrics.requestCount > 0
                ? `${((metrics.slowRequestCount / metrics.requestCount) * 100).toFixed(2)}%`
                : '0%'
        },
        system: {
            memory: process.memoryUsage(),
            cpu: process.cpuUsage(),
            platform: process.platform,
            nodeVersion: process.version
        }
    };
    res.status(200).json(healthData);
};
export const metricsEndpoint = (req, res) => {
    const uptime = Date.now() - metrics.startTime;
    const avgResponseTime = metrics.requestCount > 0
        ? metrics.totalResponseTime / metrics.requestCount
        : 0;
    const prometheusMetrics = `# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total ${metrics.requestCount}

# HELP http_errors_total Total number of HTTP errors
# TYPE http_errors_total counter
http_errors_total ${metrics.errorCount}

# HELP http_request_duration_seconds Average HTTP request duration
# TYPE http_request_duration_seconds gauge
http_request_duration_seconds ${(avgResponseTime / 1000).toFixed(6)}

# HELP http_slow_requests_total Total number of slow requests (>500ms)
# TYPE http_slow_requests_total counter
http_slow_requests_total ${metrics.slowRequestCount}

# HELP process_uptime_seconds Process uptime in seconds
# TYPE process_uptime_seconds gauge
process_uptime_seconds ${(uptime / 1000).toFixed(2)}

# HELP process_memory_bytes Memory usage in bytes
# TYPE process_memory_bytes gauge
process_memory_bytes{type="rss"} ${process.memoryUsage().rss}
process_memory_bytes{type="heapTotal"} ${process.memoryUsage().heapTotal}
process_memory_bytes{type="heapUsed"} ${process.memoryUsage().heapUsed}
process_memory_bytes{type="external"} ${process.memoryUsage().external}`;
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(prometheusMetrics);
};
export const systemStatus = (req, res) => {
    const status = {
        status: 'operational',
        timestamp: new Date().toISOString(),
        services: {
            api: 'operational',
            database: 'operational',
            authentication: 'operational'
        },
        performance: {
            currentLoad: 'normal',
            responseTime: 'optimal',
            errorRate: 'low'
        }
    };
    res.status(200).json(status);
};
export const resetMetrics = () => {
    metrics.requestCount = 0;
    metrics.errorCount = 0;
    metrics.totalResponseTime = 0;
    metrics.slowRequestCount = 0;
    metrics.startTime = Date.now();
};
export const getCurrentMetrics = () => ({ ...metrics });
//# sourceMappingURL=monitoring.js.map