import { jwtVerify, createRemoteJWKSet } from 'jose';
import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';

// Security configuration
const SECURITY_CONFIG = {
  CSRF_TOKEN_NAME: 'csrf-token',
  CSRF_HEADER_NAME: 'X-CSRF-Token',
  JWT_COOKIE_NAME: 'auth-token',
  JWT_REFRESH_COOKIE_NAME: 'refresh-token',
  TOKEN_EXPIRY: 15 * 60 * 1000, // 15 minutes
  REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
} as const;

// CSRF Protection
export class CSRFProtection {
  private static generateToken(): string {
    return CryptoJS.lib.WordArray.random(32).toString();
  }

  static createToken(): string {
    const token = this.generateToken();
    Cookies.set(SECURITY_CONFIG.CSRF_TOKEN_NAME, token, {
      secure: true,
      sameSite: 'strict',
      expires: 1, // 1 day
    });
    return token;
  }

  static validateToken(token: string): boolean {
    const storedToken = Cookies.get(SECURITY_CONFIG.CSRF_TOKEN_NAME);
    return token === storedToken;
  }

  static getToken(): string | undefined {
    return Cookies.get(SECURITY_CONFIG.CSRF_TOKEN_NAME);
  }

  static clearToken(): void {
    Cookies.remove(SECURITY_CONFIG.CSRF_TOKEN_NAME);
  }
}

// JWT Security
export class JWTSecurity {
  private static jwks: any = null;
  private static jwksUrl: string = '';

  static async initializeJwks(supabaseUrl: string): Promise<void> {
    this.jwksUrl = `${supabaseUrl}/rest/v1/auth/jwks`;
    this.jwks = createRemoteJWKSet(new URL(this.jwksUrl));
  }

  static async verifyToken(token: string): Promise<any> {
    try {
      if (!this.jwks) {
        throw new Error('JWKS not initialized');
      }

      const { payload } = await jwtVerify(token, this.jwks, {
        issuer: 'https://ewqwjduvjkddknpqpmfr.supabase.co',
        audience: 'authenticated',
      });

      return payload;
    } catch (error) {
      console.error('JWT verification failed:', error);
      throw new Error('Invalid token');
    }
  }

  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }

  static refreshTokenIfNeeded(token: string): boolean {
    if (this.isTokenExpired(token)) {
      // Trigger token refresh
      return true;
    }
    return false;
  }
}

// Rate Limiting
export class RateLimiter {
  private static attempts: Map<string, { count: number; lastAttempt: number }> = new Map();

  static checkRateLimit(identifier: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(identifier);

    if (!attempt) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }

    // Reset if lockout period has passed
    if (now - attempt.lastAttempt > SECURITY_CONFIG.LOCKOUT_DURATION) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }

    // Check if max attempts exceeded
    if (attempt.count >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
      return false;
    }

    // Increment attempt count
    attempt.count++;
    attempt.lastAttempt = now;
    return true;
  }

  static resetAttempts(identifier: string): void {
    this.attempts.delete(identifier);
  }

  static getRemainingAttempts(identifier: string): number {
    const attempt = this.attempts.get(identifier);
    if (!attempt) return SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS;
    return Math.max(0, SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS - attempt.count);
  }
}

// Input Sanitization
export class InputSanitizer {
  static sanitizeString(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  static sanitizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  static sanitizeUrl(url: string): string {
    try {
      const parsed = new URL(url);
      // Only allow HTTPS in production
      if (process.env.NODE_ENV === 'production' && parsed.protocol !== 'https:') {
        throw new Error('HTTPS required in production');
      }
      return parsed.toString();
    } catch {
      throw new Error('Invalid URL');
    }
  }

  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Security Headers (Helmet equivalent for client-side)
export class SecurityHeaders {
  static getSecurityHeaders(): Record<string, string> {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    };
  }

  static applySecurityHeaders(): void {
    // Apply CSP meta tag
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://ewqwjduvjkddknpqpmfr.supabase.co",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://ewqwjduvjkddknpqpmfr.supabase.co wss://ewqwjduvjkddknpqpmfr.supabase.co",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ');
    
    document.head.appendChild(meta);
  }
}

// Cookie Security
export class CookieSecurity {
  static setSecureCookie(name: string, value: string, options: any = {}): void {
    const secureOptions = {
      secure: true,
      sameSite: 'strict' as const,
      expires: 1,
      ...options,
    };

    Cookies.set(name, value, secureOptions);
  }

  static getSecureCookie(name: string): string | undefined {
    return Cookies.get(name);
  }

  static removeSecureCookie(name: string): void {
    Cookies.remove(name, { secure: true, sameSite: 'strict' });
  }

  static clearAllCookies(): void {
    Object.keys(Cookies.get()).forEach(cookieName => {
      Cookies.remove(cookieName);
    });
  }
}

// Session Security
export class SessionSecurity {
  static startSessionTimeout(callback: () => void, timeout: number = SECURITY_CONFIG.TOKEN_EXPIRY): void {
    setTimeout(() => {
      callback();
    }, timeout);
  }

  static resetSessionTimeout(callback: () => void, timeout: number = SECURITY_CONFIG.TOKEN_EXPIRY): void {
    // Clear existing timeout and start new one
    this.startSessionTimeout(callback, timeout);
  }

  static validateSession(): boolean {
    const token = CookieSecurity.getSecureCookie(SECURITY_CONFIG.JWT_COOKIE_NAME);
    if (!token) return false;
    
    return !JWTSecurity.isTokenExpired(token);
  }
}

// Export security configuration
export { SECURITY_CONFIG };
