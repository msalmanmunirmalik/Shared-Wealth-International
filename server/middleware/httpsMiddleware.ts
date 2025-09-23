import { Request, Response, NextFunction } from 'express';

export interface HTTPSConfig {
  enforceHTTPS: boolean;
  redirectToHTTPS: boolean;
  trustProxy: boolean;
  hstsMaxAge: number;
  includeSubDomains: boolean;
  preload: boolean;
}

/**
 * HTTPS Enforcement Middleware
 */
export class HTTPSMiddleware {
  private config: HTTPSConfig;

  constructor(config: Partial<HTTPSConfig> = {}) {
    this.config = {
      enforceHTTPS: process.env.NODE_ENV === 'production',
      redirectToHTTPS: true,
      trustProxy: true,
      hstsMaxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
      ...config
    };
  }

  /**
   * Enforce HTTPS middleware
   */
  enforceHTTPS() {
    return (req: Request, res: Response, next: NextFunction) => {
      // Skip HTTPS enforcement in development
      if (!this.config.enforceHTTPS) {
        return next();
      }

      // Check if request is secure
      const isSecure = this.isSecureRequest(req);
      
      if (!isSecure && this.config.redirectToHTTPS) {
        // Redirect to HTTPS
        const httpsUrl = this.buildHTTPSUrl(req);
        console.log(`🔄 Redirecting to HTTPS: ${req.url} -> ${httpsUrl}`);
        return res.redirect(301, httpsUrl);
      }

      // Set HSTS headers
      this.setHSTSHeaders(res);

      // Set security headers
      this.setSecurityHeaders(req, res);

      next();
    };
  }

  /**
   * Check if request is secure
   */
  private isSecureRequest(req: Request): boolean {
    // Check if connection is secure
    if (req.secure) {
      return true;
    }

    // Check X-Forwarded-Proto header (for load balancers/proxies)
    if (this.config.trustProxy) {
      const forwardedProto = req.headers['x-forwarded-proto'];
      if (forwardedProto === 'https') {
        return true;
      }

      // Check for other proxy headers
      const forwardedSSL = req.headers['x-forwarded-ssl'];
      if (forwardedSSL === 'on') {
        return true;
      }
    }

    return false;
  }

  /**
   * Build HTTPS URL
   */
  private buildHTTPSUrl(req: Request): string {
    const host = req.get('host') || 'localhost';
    const protocol = 'https';
    const path = req.originalUrl || req.url;
    
    return `${protocol}://${host}${path}`;
  }

  /**
   * Set HTTP Strict Transport Security headers
   */
  private setHSTSHeaders(res: Response): void {
    if (!this.config.enforceHTTPS) {
      return;
    }

    let hstsValue = `max-age=${this.config.hstsMaxAge}`;
    
    if (this.config.includeSubDomains) {
      hstsValue += '; includeSubDomains';
    }
    
    if (this.config.preload) {
      hstsValue += '; preload';
    }

    res.setHeader('Strict-Transport-Security', hstsValue);
  }

  /**
   * Set additional security headers
   */
  private setSecurityHeaders(req: Request, res: Response): void {
    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // Prevent clickjacking
    res.setHeader('X-Frame-Options', 'DENY');
    
    // XSS Protection
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Referrer Policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Permissions Policy
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    
    // Content Security Policy
    const csp = this.buildCSP(req);
    res.setHeader('Content-Security-Policy', csp);
  }

  /**
   * Build Content Security Policy
   */
  private buildCSP(req: Request): string {
    const isHTTPS = this.isSecureRequest(req);
    const protocol = isHTTPS ? 'https' : 'http';
    
    const directives = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${protocol}:`,
      `style-src 'self' 'unsafe-inline' ${protocol}:`,
      `img-src 'self' data: blob: ${protocol}: https:`,
      `font-src 'self' ${protocol}: https:`,
      `connect-src 'self' ${protocol}: https: wss: ws:`,
      `media-src 'self' ${protocol}: https:`,
      `object-src 'none'`,
      `frame-src 'none'`,
      `base-uri 'self'`,
      `form-action 'self'`,
      `frame-ancestors 'none'`,
      `upgrade-insecure-requests`
    ];

    return directives.join('; ');
  }

  /**
   * SSL/TLS configuration middleware
   */
  configureSSL() {
    return (req: Request, res: Response, next: NextFunction) => {
      // Set SSL-related headers
      if (this.isSecureRequest(req)) {
        res.setHeader('X-SSL-Protocol', 'TLSv1.2+');
        res.setHeader('X-SSL-Cipher', req.connection?.getCipher?.()?.name || 'unknown');
      }

      next();
    };
  }

  /**
   * Certificate validation middleware
   */
  validateCertificate() {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!this.config.enforceHTTPS) {
        return next();
      }

      // Check certificate validity (simplified)
      const cert = req.connection?.getPeerCertificate?.();
      
      if (cert && cert.valid_to) {
        const expiryDate = new Date(cert.valid_to);
        const now = new Date();
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilExpiry < 30) {
          console.warn(`⚠️ SSL Certificate expires in ${daysUntilExpiry} days`);
          res.setHeader('X-Certificate-Expiry-Warning', daysUntilExpiry.toString());
        }
      }

      next();
    };
  }

  /**
   * Get HTTPS configuration
   */
  getConfig(): HTTPSConfig {
    return { ...this.config };
  }

  /**
   * Update HTTPS configuration
   */
  updateConfig(newConfig: Partial<HTTPSConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Create default HTTPS middleware instance
export const httpsMiddleware = new HTTPSMiddleware({
  enforceHTTPS: process.env.NODE_ENV === 'production',
  redirectToHTTPS: process.env.REDIRECT_TO_HTTPS !== 'false',
  trustProxy: process.env.TRUST_PROXY !== 'false',
  hstsMaxAge: parseInt(process.env.HSTS_MAX_AGE || '31536000'),
  includeSubDomains: process.env.HSTS_INCLUDE_SUBDOMAINS !== 'false',
  preload: process.env.HSTS_PRELOAD !== 'false'
});

export default HTTPSMiddleware;
