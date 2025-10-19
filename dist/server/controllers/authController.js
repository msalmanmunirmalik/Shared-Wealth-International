import { AuthService } from '../services/authService.js';
export class AuthController {
    static async signIn(req, res) {
        try {
            const credentials = req.body;
            if (typeof credentials.email !== 'string' || typeof credentials.password !== 'string') {
                res.status(400).json({
                    success: false,
                    message: 'Invalid input types'
                });
                return;
            }
            const result = await AuthService.signIn(credentials);
            if (result.success && result.data) {
                res.json({ session: result.data });
            }
            else {
                res.status(401).json({
                    success: false,
                    message: result.message
                });
            }
        }
        catch (error) {
            console.error('Sign in controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async signUp(req, res) {
        try {
            const userData = req.body;
            if (typeof userData.email !== 'string' || typeof userData.password !== 'string') {
                res.status(400).json({
                    success: false,
                    message: 'Invalid input types'
                });
                return;
            }
            const enhancedUserData = {
                email: userData.email,
                password: userData.password,
                firstName: userData.firstName,
                lastName: userData.lastName,
                phone: userData.phone,
                role: userData.role || 'user',
                selectedCompanyId: userData.selectedCompanyId,
                position: userData.position,
                companyName: userData.companyName,
                bio: userData.bio,
                location: userData.location,
                website: userData.website,
                linkedin: userData.linkedin,
                twitter: userData.twitter,
                profileImage: userData.profileImage
            };
            const result = await AuthService.signUp(enhancedUserData);
            if (result.success) {
                res.status(201).json({
                    success: true,
                    message: result.message,
                    data: {
                        userId: result.data?.userId,
                        token: result.data?.token
                    }
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    message: result.message
                });
            }
        }
        catch (error) {
            console.error('Sign up controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async signOut(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
                return;
            }
            const result = await AuthService.signOut(userId);
            if (result.success) {
                res.json({
                    success: true,
                    message: result.data?.message
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
            console.error('Sign out controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async resetPassword(req, res) {
        try {
            const { email } = req.body;
            if (typeof email !== 'string') {
                res.status(400).json({
                    success: false,
                    message: 'Invalid input type'
                });
                return;
            }
            const result = await AuthService.resetPassword(email);
            if (result.success) {
                res.json({
                    success: true,
                    message: result.data?.message
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
            console.error('Reset password controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async checkAdminStatus(req, res) {
        try {
            const { userId } = req.params;
            if (!userId || typeof userId !== 'string') {
                res.status(400).json({
                    success: false,
                    message: 'Invalid user ID'
                });
                return;
            }
            const result = await AuthService.isAdmin(userId);
            if (result.success) {
                res.json({
                    success: true,
                    isAdmin: result.data?.isAdmin
                });
            }
            else {
                res.status(404).json({
                    success: false,
                    message: result.message
                });
            }
        }
        catch (error) {
            console.error('Admin check controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async checkSuperAdminStatus(req, res) {
        try {
            const { userId } = req.params;
            if (!userId || typeof userId !== 'string') {
                res.status(400).json({
                    success: false,
                    message: 'Invalid user ID'
                });
                return;
            }
            const result = await AuthService.isSuperAdmin(userId);
            if (result.success) {
                res.json({
                    success: true,
                    isSuperAdmin: result.data?.isSuperAdmin
                });
            }
            else {
                res.status(404).json({
                    success: false,
                    message: result.message
                });
            }
        }
        catch (error) {
            console.error('Super admin check controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getCurrentUser(req, res) {
        try {
            const user = req.user;
            if (!user) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
                return;
            }
            res.json({
                success: true,
                data: user
            });
        }
        catch (error) {
            console.error('Get current user controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}
//# sourceMappingURL=authController.js.map