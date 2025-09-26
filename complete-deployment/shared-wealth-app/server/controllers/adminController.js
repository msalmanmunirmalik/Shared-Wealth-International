import { AdminService } from '../services/adminService.js';
export class AdminController {
    static async getAdminStats(req, res) {
        try {
            const result = await AdminService.getAdminStats();
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
            console.error('Get admin stats controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getUsers(req, res) {
        try {
            const { page, limit } = req.query;
            let pagination;
            if (page && limit) {
                pagination = {
                    page: parseInt(page),
                    limit: parseInt(limit)
                };
            }
            const result = await AdminService.getUsers(pagination);
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
            console.error('Get users controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getUserById(req, res) {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                res.status(400).json({
                    success: false,
                    message: 'Invalid user ID'
                });
                return;
            }
            const result = await AdminService.getUserById(id);
            if (result.success) {
                res.json(result.data);
            }
            else if (result.message === 'User not found') {
                res.status(404).json({
                    success: false,
                    message: result.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message
                });
            }
        }
        catch (error) {
            console.error('Get user controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async updateUserRole(req, res) {
        try {
            const { id } = req.params;
            const { role } = req.body;
            if (!id || typeof id !== 'string') {
                res.status(400).json({
                    success: false,
                    message: 'Invalid user ID'
                });
                return;
            }
            if (!role || !['user', 'admin', 'superadmin'].includes(role)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid role. Must be user, admin, or superadmin'
                });
                return;
            }
            const result = await AdminService.updateUserRole(id, role);
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
            console.error('Update user role controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async updateUser(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            if (!id || typeof id !== 'string') {
                res.status(400).json({
                    success: false,
                    message: 'Invalid user ID'
                });
                return;
            }
            const result = await AdminService.updateUser(id, updateData);
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
            console.error('Update user controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async deleteUser(req, res) {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                res.status(400).json({
                    success: false,
                    message: 'Invalid user ID'
                });
                return;
            }
            const result = await AdminService.deleteUser(id);
            if (result.success) {
                res.json({
                    success: true,
                    message: result.data?.message
                });
            }
            else if (result.message === 'User not found') {
                res.status(404).json({
                    success: false,
                    message: result.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message
                });
            }
        }
        catch (error) {
            console.error('Delete user controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async approveCompany(req, res) {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                res.status(400).json({
                    success: false,
                    message: 'Invalid company ID'
                });
                return;
            }
            const result = await AdminService.approveCompany(id);
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
            console.error('Approve company controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async rejectCompany(req, res) {
        try {
            const { id } = req.params;
            const { reason } = req.body;
            if (!id || typeof id !== 'string') {
                res.status(400).json({
                    success: false,
                    message: 'Invalid company ID'
                });
                return;
            }
            const result = await AdminService.rejectCompany(id, reason);
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
            console.error('Reject company controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getSystemHealth(req, res) {
        try {
            const result = await AdminService.getSystemHealth();
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
    static async getAnalytics(req, res) {
        try {
            const result = await AdminService.getAnalytics();
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
            console.error('Get analytics controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getFundingAnalytics(req, res) {
        try {
            const result = await AdminService.getFundingAnalytics();
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
            console.error('Get funding analytics controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getAuditLog(req, res) {
        try {
            const { page, limit, action, userId, dateFrom, dateTo } = req.query;
            let pagination;
            if (page && limit) {
                pagination = {
                    page: parseInt(page),
                    limit: parseInt(limit)
                };
            }
            const filters = {
                action: action,
                userId: userId,
                dateFrom: dateFrom,
                dateTo: dateTo
            };
            const result = await AdminService.getAuditLog(pagination, filters);
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
            console.error('Get audit log controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}
//# sourceMappingURL=adminController.js.map