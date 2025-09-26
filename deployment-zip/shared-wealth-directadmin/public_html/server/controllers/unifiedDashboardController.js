import { UnifiedDashboardService } from '../services/unifiedDashboardService.js';
export class UnifiedDashboardController {
    static async getDashboard(req, res) {
        try {
            const userId = req.user?.id;
            const { sections = 'all', period = '30d' } = req.query;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
                return;
            }
            const result = await UnifiedDashboardService.getDashboardData(userId, {
                sections: sections,
                period: period
            });
            if (result.success) {
                res.json({
                    success: true,
                    data: result.data
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message || 'Failed to get dashboard data'
                });
            }
        }
        catch (error) {
            console.error('Get dashboard error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getUserDashboard(req, res) {
        try {
            const { userId } = req.params;
            const { period = '30d' } = req.query;
            const authUserId = req.user?.id;
            if (authUserId !== userId && req.user?.role !== 'admin') {
                res.status(403).json({
                    success: false,
                    message: 'Unauthorized to view this dashboard'
                });
                return;
            }
            const result = await UnifiedDashboardService.getUserDashboardData(userId, period);
            if (result.success) {
                res.json({
                    success: true,
                    data: result.data
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message || 'Failed to get user dashboard data'
                });
            }
        }
        catch (error) {
            console.error('Get user dashboard error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getCompanyDashboard(req, res) {
        try {
            const { companyId } = req.params;
            const { period = '30d' } = req.query;
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
                return;
            }
            const hasAccess = await UnifiedDashboardService.checkCompanyAccess(userId, companyId);
            if (!hasAccess) {
                res.status(403).json({
                    success: false,
                    message: 'Unauthorized to view this company dashboard'
                });
                return;
            }
            const result = await UnifiedDashboardService.getCompanyDashboardData(companyId, period);
            if (result.success) {
                res.json({
                    success: true,
                    data: result.data
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message || 'Failed to get company dashboard data'
                });
            }
        }
        catch (error) {
            console.error('Get company dashboard error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getAdminDashboard(req, res) {
        try {
            const userId = req.user?.id;
            const { period = '30d' } = req.query;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
                return;
            }
            const isAdmin = await UnifiedDashboardService.checkAdminAccess(userId);
            if (!isAdmin) {
                res.status(403).json({
                    success: false,
                    message: 'Admin access required'
                });
                return;
            }
            const result = await UnifiedDashboardService.getAdminDashboardData(period);
            if (result.success) {
                res.json({
                    success: true,
                    data: result.data
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message || 'Failed to get admin dashboard data'
                });
            }
        }
        catch (error) {
            console.error('Get admin dashboard error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getDashboardAnalytics(req, res) {
        try {
            const userId = req.user?.id;
            const { type = 'overview', period = '30d', entityId, entityType } = req.query;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
                return;
            }
            const result = await UnifiedDashboardService.getAnalytics(userId, {
                type: type,
                period: period,
                entityId: entityId,
                entityType: entityType
            });
            if (result.success) {
                res.json({
                    success: true,
                    data: result.data
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message || 'Failed to get analytics'
                });
            }
        }
        catch (error) {
            console.error('Get analytics error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getDashboardWidgets(req, res) {
        try {
            const userId = req.user?.id;
            const { dashboardType = 'user' } = req.query;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
                return;
            }
            const result = await UnifiedDashboardService.getDashboardWidgets(userId, dashboardType);
            if (result.success) {
                res.json({
                    success: true,
                    data: result.data
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message || 'Failed to get dashboard widgets'
                });
            }
        }
        catch (error) {
            console.error('Get dashboard widgets error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async updateDashboardWidgets(req, res) {
        try {
            const userId = req.user?.id;
            const { widgets } = req.body;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
                return;
            }
            if (!widgets || !Array.isArray(widgets)) {
                res.status(400).json({
                    success: false,
                    message: 'Widgets configuration is required'
                });
                return;
            }
            const result = await UnifiedDashboardService.updateDashboardWidgets(userId, widgets);
            if (result.success) {
                res.json({
                    success: true,
                    data: result.data,
                    message: 'Dashboard widgets updated successfully'
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message || 'Failed to update dashboard widgets'
                });
            }
        }
        catch (error) {
            console.error('Update dashboard widgets error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getDashboardNotifications(req, res) {
        try {
            const userId = req.user?.id;
            const { limit = '10', offset = '0', type = 'all' } = req.query;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
                return;
            }
            const result = await UnifiedDashboardService.getNotifications(userId, {
                limit: parseInt(limit),
                offset: parseInt(offset),
                type: type
            });
            if (result.success) {
                res.json({
                    success: true,
                    data: result.data,
                    pagination: {
                        limit: parseInt(limit),
                        offset: parseInt(offset),
                        total: result.total || 0
                    }
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message || 'Failed to get notifications'
                });
            }
        }
        catch (error) {
            console.error('Get notifications error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async markNotificationRead(req, res) {
        try {
            const userId = req.user?.id;
            const { notificationId } = req.params;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
                return;
            }
            const result = await UnifiedDashboardService.markNotificationRead(userId, notificationId);
            if (result.success) {
                res.json({
                    success: true,
                    message: 'Notification marked as read'
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message || 'Failed to mark notification as read'
                });
            }
        }
        catch (error) {
            console.error('Mark notification read error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getActivityFeed(req, res) {
        try {
            const userId = req.user?.id;
            const { limit = '20', offset = '0', type = 'all' } = req.query;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
                return;
            }
            const result = await UnifiedDashboardService.getActivityFeed(userId, {
                limit: parseInt(limit),
                offset: parseInt(offset),
                type: type
            });
            if (result.success) {
                res.json({
                    success: true,
                    data: result.data,
                    pagination: {
                        limit: parseInt(limit),
                        offset: parseInt(offset),
                        total: result.total || 0
                    }
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message || 'Failed to get activity feed'
                });
            }
        }
        catch (error) {
            console.error('Get activity feed error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}
//# sourceMappingURL=unifiedDashboardController.js.map