import { MonitoringService } from '../services/monitoringService.js';
export class MonitoringController {
    static async getSystemHealth(req, res) {
        try {
            const result = await MonitoringService.getSystemHealth();
            if (result.success) {
                res.json(result.data);
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message
                });
            }
        }
        catch (error) {
            console.error('Get system health controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getPerformanceMetrics(req, res) {
        try {
            const result = await MonitoringService.getPerformanceMetrics();
            if (result.success) {
                res.json(result.data);
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message
                });
            }
        }
        catch (error) {
            console.error('Get performance metrics controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getDatabaseMetrics(req, res) {
        try {
            const result = await MonitoringService.getDatabaseMetrics();
            if (result.success) {
                res.json(result.data);
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message
                });
            }
        }
        catch (error) {
            console.error('Get database metrics controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getSecurityEvents(req, res) {
        try {
            const { limit } = req.query;
            const limitNumber = limit ? parseInt(limit) : 50;
            const result = await MonitoringService.getSecurityEvents(limitNumber);
            if (result.success) {
                res.json(result.data);
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message
                });
            }
        }
        catch (error) {
            console.error('Get security events controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getSystemLogs(req, res) {
        try {
            const { limit } = req.query;
            const limitNumber = limit ? parseInt(limit) : 100;
            const result = await MonitoringService.getSystemLogs(limitNumber);
            if (result.success) {
                res.json(result.data);
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message
                });
            }
        }
        catch (error) {
            console.error('Get system logs controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getDiskUsage(req, res) {
        try {
            const result = await MonitoringService.getDiskUsage();
            if (result.success) {
                res.json(result.data);
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message
                });
            }
        }
        catch (error) {
            console.error('Get disk usage controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static recordApiPerformance(endpoint, method, responseTime, success) {
        MonitoringService.recordApiPerformance(endpoint, method, responseTime, success);
    }
    static recordSecurityEvent(event) {
        MonitoringService.recordSecurityEvent({
            ...event,
            timestamp: new Date().toISOString()
        });
    }
}
//# sourceMappingURL=monitoringController.js.map