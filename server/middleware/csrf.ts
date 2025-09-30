import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { Session } from 'express-session';

// Extend Request interface to include CSRF token
declare global {
  namespace Express {
    interface Request {
      csrfToken?: () => string;
    }
  }
}

// Extend Session interface to include CSRF token
declare module 'express-session' {
  interface SessionData {
    csrfToken?: string;
  }
}

export interface CSRFConfig {
  secret: string;
  cookieName?: string;
  headerName?: string;
  tokenLength?: number;
  ignoreMethods?: string[];
  ignorePaths?: string[];
}

const defaultConfig: Required<CSRFConfig> = {
  secret: process.env.CSRF_SECRET || 'default-csrf-secret-change-in-production',
  cookieName: '_csrf',
  headerName: 'x-csrf-token',
  tokenLength: 32,
  ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
  ignorePaths: ['/api/health', '/api/auth/signin']
};

/**
 * CSRF Protection Middleware
 * Generates and validates CSRF tokens for state-changing operations
 */
export class CSRFProtection {
  private config: Required<CSRFConfig>;

  constructor(config: Partial<CSRFConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Generate a cryptographically secure CSRF token
   */
  private generateToken(): string {
    return crypto.randomBytes(this.config.tokenLength).toString('hex');
  }

  /**
   * Create HMAC signature for token validation
   */
  private createSignature(token: string): string {
    return crypto
      .createHmac('sha256', this.config.secret)
      .update(token)
      .digest('hex');
  }

  /**
   * Verify token signature
   */
  private verifySignature(token: string, signature: string): boolean {
    const expectedSignature = this.createSignature(token);
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }

  /**
   * Extract token from request
   */
  private extractToken(req: Request): string | null {
    // Check header first
    const headerToken = req.headers[this.config.headerName] as string;
    if (headerToken) {
      return headerToken;
    }

    // Check body
    const bodyToken = req.body?._csrf || req.body?.csrf_token;
    if (bodyToken) {
      return bodyToken;
    }

    // Check query parameter (less secure, but sometimes needed)
    const queryToken = req.query._csrf as string;
    if (queryToken) {
      return queryToken;
    }

    return null;
  }

  /**
   * Check if request should be ignored
   */
  private shouldIgnore(req: Request): boolean {
    // Check ignored methods
    if (this.config.ignoreMethods.includes(req.method)) {
      return true;
    }

    // Check ignored paths
    const path = req.path;
    return this.config.ignorePaths.some(ignorePath => 
      path.startsWith(ignorePath)
    );
  }

  /**
   * CSRF middleware function
   */
  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      // Skip CSRF protection for ignored requests
      if (this.shouldIgnore(req)) {
        return next();
      }

      // Initialize session if not exists
      if (!req.session) {
        return res.status(500).json({
          success: false,
          error: 'Session not available',
          message: 'Session middleware must be configured before CSRF middleware'
        });
      }

      // Generate or retrieve CSRF token
      let csrfToken = req.session.csrfToken;
      if (!csrfToken) {
        csrfToken = this.generateToken();
        req.session.csrfToken = csrfToken;
      }

      // Add token to response locals for template rendering
      res.locals.csrfToken = csrfToken;

      // Add token generation method to request
      req.csrfToken = () => csrfToken;

      // For state-changing methods, validate the token
      if (!this.config.ignoreMethods.includes(req.method)) {
        const providedToken = this.extractToken(req);
        
        if (!providedToken) {
          console.warn(`CSRF: No token provided for ${req.method} ${req.path}`);
          return res.status(403).json({
            success: false,
            error: 'CSRF token missing',
            message: 'A CSRF token is required for this operation'
          });
        }

        // Verify token signature
        const tokenParts = providedToken.split('.');
        if (tokenParts.length !== 2) {
          console.warn(`CSRF: Invalid token format for ${req.method} ${req.path}`);
          return res.status(403).json({
            success: false,
            error: 'Invalid CSRF token format',
            message: 'The CSRF token format is invalid'
          });
        }

        const [token, signature] = tokenParts;
        
        if (!this.verifySignature(token, signature)) {
          console.warn(`CSRF: Token verification failed for ${req.method} ${req.path}`);
          return res.status(403).json({
            success: false,
            error: 'Invalid CSRF token',
            message: 'The CSRF token is invalid or has expired'
          });
        }

        // Verify token matches session token
        if (token !== req.session.csrfToken) {
          console.warn(`CSRF: Token mismatch for ${req.method} ${req.path}`);
          return res.status(403).json({
            success: false,
            error: 'CSRF token mismatch',
            message: 'The CSRF token does not match the session'
          });
        }
      }

      next();
    };
  }

  /**
   * Generate a signed CSRF token for API responses
   */
  generateSignedToken(sessionToken: string): string {
    const signature = this.createSignature(sessionToken);
    return `${sessionToken}.${signature}`;
  }

  /**
   * Get CSRF token endpoint handler
   */
  tokenEndpoint() {
    return (req: Request, res: Response) => {
      if (!req.session?.csrfToken) {
        return res.status(500).json({
          success: false,
          error: 'Session not initialized',
          message: 'CSRF token not available'
        });
      }

      const signedToken = this.generateSignedToken(req.session.csrfToken);
      
      res.json({
        success: true,
        csrfToken: signedToken,
        message: 'CSRF token generated successfully'
      });
    };
  }
}

// Create default CSRF protection instance
export const csrfProtection = new CSRFProtection({
  secret: process.env.CSRF_SECRET || 'wealth-pioneers-csrf-secret-2024',
  cookieName: '_wealth_pioneers_csrf',
  headerName: 'x-csrf-token',
  ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
  ignorePaths: [
    '/api/health',
    '/api/auth/signin',
    '/api/auth/signout',
    '/api/auth/refresh'
  ]
});

export default csrfProtection;
