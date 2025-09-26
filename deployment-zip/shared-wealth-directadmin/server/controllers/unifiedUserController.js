import { UnifiedUserService } from '../services/unifiedUserService.js';
export class UnifiedUserController {
    static async register(req, res) {
        try {
            const { email, password, firstName, lastName, role = 'user' } = req.body;
            if (!email || !password || !firstName || !lastName) {
                res.status(400).json({
                    success: false,
                    message: 'Email, password, first name, and last name are required'
                });
                return;
            }
            const result = await UnifiedUserService.register({
                email,
                password,
                firstName,
                lastName,
                role
            });
            if (result.success) {
                res.status(201).json({
                    success: true,
                    data: result.data,
                    message: 'User registered successfully'
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    message: result.message || 'Registration failed'
                });
            }
        }
        catch (error) {
            console.error('Register error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({
                    success: false,
                    message: 'Email and password are required'
                });
                return;
            }
            const result = await UnifiedUserService.login(email, password);
            if (result.success) {
                res.json({
                    success: true,
                    data: result.data,
                    message: 'Login successful'
                });
            }
            else {
                res.status(401).json({
                    success: false,
                    message: result.message || 'Invalid credentials'
                });
            }
        }
        catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async logout(req, res) {
        try {
            const userId = req.user?.id;
            if (userId) {
                await UnifiedUserService.logout(userId);
            }
            res.json({
                success: true,
                message: 'Logout successful'
            });
        }
        catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getProfile(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
                return;
            }
            const result = await UnifiedUserService.getUserProfile(userId);
            if (result.success) {
                res.json({
                    success: true,
                    data: result.data
                });
            }
            else {
                res.status(404).json({
                    success: false,
                    message: result.message || 'User not found'
                });
            }
        }
        catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async updateProfile(req, res) {
        try {
            const userId = req.user?.id;
            const { firstName, lastName, bio, avatar, preferences } = req.body;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
                return;
            }
            const result = await UnifiedUserService.updateUserProfile(userId, {
                firstName,
                lastName,
                bio,
                avatar,
                preferences
            });
            if (result.success) {
                res.json({
                    success: true,
                    data: result.data,
                    message: 'Profile updated successfully'
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message || 'Failed to update profile'
                });
            }
        }
        catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async changePassword(req, res) {
        try {
            const userId = req.user?.id;
            const { currentPassword, newPassword } = req.body;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
                return;
            }
            if (!currentPassword || !newPassword) {
                res.status(400).json({
                    success: false,
                    message: 'Current password and new password are required'
                });
                return;
            }
            const result = await UnifiedUserService.changePassword(userId, currentPassword, newPassword);
            if (result.success) {
                res.json({
                    success: true,
                    message: 'Password changed successfully'
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    message: result.message || 'Failed to change password'
                });
            }
        }
        catch (error) {
            console.error('Change password error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getUser(req, res) {
        try {
            const { userId } = req.params;
            const authUserId = req.user?.id;
            if (authUserId !== userId && req.user?.role !== 'admin') {
                res.status(403).json({
                    success: false,
                    message: 'Unauthorized to view this user'
                });
                return;
            }
            const result = await UnifiedUserService.getUserProfile(userId);
            if (result.success) {
                res.json({
                    success: true,
                    data: result.data
                });
            }
            else {
                res.status(404).json({
                    success: false,
                    message: result.message || 'User not found'
                });
            }
        }
        catch (error) {
            console.error('Get user error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getAllUsers(req, res) {
        try {
            const userId = req.user?.id;
            const { limit = '20', offset = '0', search, role, status } = req.query;
            const isAdmin = await UnifiedUserService.checkAdminAccess(userId);
            if (!isAdmin) {
                res.status(403).json({
                    success: false,
                    message: 'Admin access required'
                });
                return;
            }
            const result = await UnifiedUserService.getAllUsers({
                limit: parseInt(limit),
                offset: parseInt(offset),
                search: search,
                role: role,
                status: status
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
                    message: result.message || 'Failed to get users'
                });
            }
        }
        catch (error) {
            console.error('Get all users error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async updateUser(req, res) {
        try {
            const { userId } = req.params;
            const { firstName, lastName, email, role, status, bio, avatar } = req.body;
            const authUserId = req.user?.id;
            const isAdmin = await UnifiedUserService.checkAdminAccess(authUserId);
            if (!isAdmin) {
                res.status(403).json({
                    success: false,
                    message: 'Admin access required'
                });
                return;
            }
            const result = await UnifiedUserService.updateUser(userId, {
                firstName,
                lastName,
                email,
                role,
                status,
                bio,
                avatar
            });
            if (result.success) {
                res.json({
                    success: true,
                    data: result.data,
                    message: 'User updated successfully'
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message || 'Failed to update user'
                });
            }
        }
        catch (error) {
            console.error('Update user error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async deleteUser(req, res) {
        try {
            const { userId } = req.params;
            const authUserId = req.user?.id;
            const isAdmin = await UnifiedUserService.checkAdminAccess(authUserId);
            if (!isAdmin) {
                res.status(403).json({
                    success: false,
                    message: 'Admin access required'
                });
                return;
            }
            if (authUserId === userId) {
                res.status(400).json({
                    success: false,
                    message: 'Cannot delete your own account'
                });
                return;
            }
            const result = await UnifiedUserService.deleteUser(userId);
            if (result.success) {
                res.json({
                    success: true,
                    message: 'User deleted successfully'
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message || 'Failed to delete user'
                });
            }
        }
        catch (error) {
            console.error('Delete user error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getUserStats(req, res) {
        try {
            const { userId } = req.params;
            const authUserId = req.user?.id;
            if (authUserId !== userId && req.user?.role !== 'admin') {
                res.status(403).json({
                    success: false,
                    message: 'Unauthorized to view this user\'s statistics'
                });
                return;
            }
            const result = await UnifiedUserService.getUserStats(userId);
            if (result.success) {
                res.json({
                    success: true,
                    data: result.data
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message || 'Failed to get user statistics'
                });
            }
        }
        catch (error) {
            console.error('Get user stats error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getUserActivity(req, res) {
        try {
            const { userId } = req.params;
            const { limit = '20', offset = '0', type } = req.query;
            const authUserId = req.user?.id;
            if (authUserId !== userId && req.user?.role !== 'admin') {
                res.status(403).json({
                    success: false,
                    message: 'Unauthorized to view this user\'s activity'
                });
                return;
            }
            const result = await UnifiedUserService.getUserActivity(userId, {
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
                    message: result.message || 'Failed to get user activity'
                });
            }
        }
        catch (error) {
            console.error('Get user activity error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async verifyEmail(req, res) {
        try {
            const { token } = req.params;
            const result = await UnifiedUserService.verifyEmail(token);
            if (result.success) {
                res.json({
                    success: true,
                    message: 'Email verified successfully'
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    message: result.message || 'Invalid verification token'
                });
            }
        }
        catch (error) {
            console.error('Verify email error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async requestPasswordReset(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                res.status(400).json({
                    success: false,
                    message: 'Email is required'
                });
                return;
            }
            const result = await UnifiedUserService.requestPasswordReset(email);
            if (result.success) {
                res.json({
                    success: true,
                    message: 'Password reset email sent'
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    message: result.message || 'Failed to send password reset email'
                });
            }
        }
        catch (error) {
            console.error('Request password reset error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async resetPassword(req, res) {
        try {
            const { token } = req.params;
            const { newPassword } = req.body;
            if (!newPassword) {
                res.status(400).json({
                    success: false,
                    message: 'New password is required'
                });
                return;
            }
            const result = await UnifiedUserService.resetPassword(token, newPassword);
            if (result.success) {
                res.json({
                    success: true,
                    message: 'Password reset successfully'
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    message: result.message || 'Invalid reset token'
                });
            }
        }
        catch (error) {
            console.error('Reset password error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}
//# sourceMappingURL=unifiedUserController.js.map