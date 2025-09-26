import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { DatabaseService } from '../../src/integrations/postgresql/database.js';
import { JWTPayload, User } from '../types/index.js';

// Extend Express Request interface with proper typing
export interface AuthenticatedRequest extends Request {
  user?: User;
}

// JWT secret validation
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('❌ CRITICAL: JWT_SECRET environment variable is not set!');
  process.exit(1);
}

/**
 * Authentication middleware with proper error handling
 */
export const authenticateToken = async (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
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

    // Security: Validate JWT token with issuer and audience verification
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'shared-wealth-international',
      audience: 'wealth-pioneers-users'
    }) as JWTPayload;
    console.log('🔐 Auth Debug - Decoded JWT:', decoded);
    
    if (!decoded || !decoded.userId) {
      res.status(401).json({ 
        success: false,
        message: 'Invalid token format' 
      });
      return;
    }

    // Security: Check if user exists and is active
    const user = await DatabaseService.findOne('users', { where: { id: decoded.userId } });
    console.log('🔐 Auth Debug - Found User:', user ? { id: user.id, email: user.email, role: user.role } : 'Not found');
    
    if (!user) {
      res.status(401).json({ 
        success: false,
        message: 'User not found' 
      });
      return;
    }

    // Security: Validate user role
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
  } catch (error) {
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

/**
 * Admin role validation middleware
 */
export const requireAdmin = (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
): void => {
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

/**
 * Super admin role validation middleware
 */
export const requireSuperAdmin = (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
): void => {
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

/**
 * Optional authentication middleware (doesn't fail if no token)
 */
export const optionalAuth = async (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
      if (decoded?.userId) {
        const user = await DatabaseService.findOne('users', { where: { id: decoded.userId } });
        if (user && ['user', 'admin', 'superadmin'].includes(user.role)) {
          req.user = user;
        }
      }
    }
    
    next();
  } catch (error) {
    // Don't fail for optional auth, just continue without user
    next();
  }
};
