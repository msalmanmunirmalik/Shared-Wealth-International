import jwt from 'jsonwebtoken';
import { DatabaseService } from '../../src/integrations/postgresql/database.js';
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error('❌ CRITICAL: JWT_SECRET environment variable is not set!');
    process.exit(1);
}
export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        console.log('🔐 Auth Debug - Token:', token ? 'Present' : 'Missing');
        console.log('🔐 Auth Debug - Auth Header:', authHeader);
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Access token required'
            });
            return;
        }
        const decoded = jwt.verify(token, JWT_SECRET, {
            issuer: 'shared-wealth-international',
            audience: 'wealth-pioneers-users'
        });
        console.log('🔐 Auth Debug - Decoded JWT:', decoded);
        if (!decoded || !decoded.userId) {
            res.status(401).json({
                success: false,
                message: 'Invalid token format'
            });
            return;
        }
        const user = await DatabaseService.findOne('users', { where: { id: decoded.userId } });
        console.log('🔐 Auth Debug - Found User:', user ? { id: user.id, email: user.email, role: user.role } : 'Not found');
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        if (!['user', 'admin', 'superadmin', 'director'].includes(user.role)) {
            res.status(401).json({
                success: false,
                message: 'Invalid user role'
            });
            return;
        }
        req.user = user;
        console.log('🔐 Auth Debug - Set req.user:', { id: req.user?.id, email: req.user?.email, role: req.user?.role });
        next();
    }
    catch (error) {
        console.error('🔐 Auth Debug - Error:', error);
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(403).json({
                success: false,
                message: 'Invalid token'
            });
            return;
        }
        if (error instanceof jwt.TokenExpiredError) {
            res.status(403).json({
                success: false,
                message: 'Token expired'
            });
            return;
        }
        console.error('Authentication error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
export const requireAdmin = (req, res, next) => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
        return;
    }
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
        res.status(403).json({
            success: false,
            message: 'Admin access required'
        });
        return;
    }
    next();
};
export const requireSuperAdmin = (req, res, next) => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
        return;
    }
    if (req.user.role !== 'superadmin') {
        res.status(403).json({
            success: false,
            message: 'Super admin access required'
        });
        return;
    }
    next();
};
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token) {
            const decoded = jwt.verify(token, JWT_SECRET);
            if (decoded?.userId) {
                const user = await DatabaseService.findOne('users', { where: { id: decoded.userId } });
                if (user && ['user', 'admin', 'superadmin'].includes(user.role)) {
                    req.user = user;
                }
            }
        }
        next();
    }
    catch (error) {
        next();
    }
};
//# sourceMappingURL=auth.js.map