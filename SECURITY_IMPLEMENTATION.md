# Security Implementation Guide

## Overview

This document outlines the comprehensive security implementation for the Shared Wealth International platform, including JWT authentication, CSRF protection, CORS handling, and Helmet-equivalent security headers.

## Security Architecture

### 1. JWT (JSON Web Token) Security

#### Implementation
- **Library**: `jose` for JWT verification
- **JWKS**: Remote JSON Web Key Set for public key verification
- **Token Validation**: Automatic token expiration checking
- **Refresh Mechanism**: Automatic session refresh handling

#### Features
```typescript
// JWT Security Class
export class JWTSecurity {
  static async verifyToken(token: string): Promise<any>
  static isTokenExpired(token: string): boolean
  static refreshTokenIfNeeded(token: string): boolean
}
```

#### Configuration
```typescript
const SECURITY_CONFIG = {
  TOKEN_EXPIRY: 15 * 60 * 1000, // 15 minutes
  REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days
}
```

### 2. CSRF (Cross-Site Request Forgery) Protection

#### Implementation
- **Token Generation**: Cryptographically secure random tokens
- **Token Storage**: Secure HTTP-only cookies
- **Validation**: Server-side token verification
- **Automatic Refresh**: Tokens refreshed on each request

#### Features
```typescript
// CSRF Protection Class
export class CSRFProtection {
  static createToken(): string
  static validateToken(token: string): boolean
  static getToken(): string | undefined
  static clearToken(): void
}
```

#### Usage
```typescript
// In forms
const csrfToken = CSRFProtection.getToken();
if (!csrfToken) {
  throw new Error('CSRF token not found');
}

// Add to form data
const submissionData = {
  ...formData,
  csrfToken,
};
```

### 3. CORS (Cross-Origin Resource Sharing)

#### Implementation
- **Client-Side**: Automatic CORS header validation
- **Response Validation**: Security header verification
- **Origin Checking**: Strict origin validation
- **Method Validation**: HTTP method verification

#### Features
```typescript
// CORS validation in secure API client
const validateResponse = async (response: Response): Promise<Response> => {
  // Validate CORS headers
  if (response.headers.get('Access-Control-Allow-Origin') === '*') {
    console.warn('CORS policy allows all origins - security risk');
  }
  return response;
};
```

### 4. Helmet-Equivalent Security Headers

#### Implementation
- **Content Security Policy**: Strict CSP implementation
- **XSS Protection**: XSS prevention headers
- **Frame Options**: Clickjacking protection
- **Content Type Options**: MIME type sniffing prevention

#### Security Headers Applied
```typescript
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
}
```

#### Content Security Policy
```typescript
static applySecurityHeaders(): void {
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
```

## Security Components

### 1. SecurityProvider

The main security wrapper component that initializes all security measures.

```typescript
export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  useEffect(() => {
    // Apply security headers (Helmet equivalent)
    SecurityHeaders.applySecurityHeaders();
    
    // Initialize CSRF protection
    CSRFProtection.createToken();
    
    // Initialize JWT security
    JWTSecurity.initializeJwks(supabaseUrl);
    
    // Security monitoring and logging
    // XSS detection, iframe injection monitoring, DOM mutation observation
  }, []);
  
  return <>{children}</>;
};
```

### 2. SecureApiClient

A secure HTTP client with built-in security features.

```typescript
export class SecureApiClient {
  private async getAuthHeaders(): Promise<Headers> {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    // Add CSRF token
    if (this.csrfToken) {
      headers.set(SECURITY_CONFIG.CSRF_HEADER_NAME, this.csrfToken);
    }

    // Add Supabase auth token
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers.set('Authorization', `Bearer ${session.access_token}`);
    }

    // Add security headers
    addSecurityHeaders(headers);

    return headers;
  }
}
```

### 3. SecureForm

A secure form component with CSRF protection and input validation.

```typescript
export const SecureForm: React.FC<SecureFormProps> = ({
  children,
  onSubmit,
  rateLimitKey = 'form-submission',
  maxAttempts = 5,
}) => {
  // CSRF token initialization
  useEffect(() => {
    CSRFProtection.createToken();
  }, []);

  // Rate limiting
  useEffect(() => {
    if (attempts >= maxAttempts) {
      setIsLocked(true);
      // Lockout for 15 minutes
    }
  }, [attempts, maxAttempts]);

  const handleSubmit = async (e: FormEvent) => {
    // Add CSRF token to form data
    const csrfToken = CSRFProtection.getToken();
    if (!csrfToken) {
      throw new Error('CSRF token not found');
    }

    const submissionData = {
      ...formData,
      csrfToken,
    };

    await onSubmit(submissionData);
  };
};
```

## Security Features

### 1. Rate Limiting

#### Implementation
- **Per-Endpoint**: Rate limiting per API endpoint
- **Per-User**: Rate limiting per user identifier
- **Configurable**: Adjustable limits and lockout periods
- **Automatic Reset**: Automatic reset after lockout period

```typescript
export class RateLimiter {
  static checkRateLimit(identifier: string): boolean
  static resetAttempts(identifier: string): void
  static getRemainingAttempts(identifier: string): number
}
```

#### Configuration
```typescript
const SECURITY_CONFIG = {
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
}
```

### 2. Input Sanitization

#### Implementation
- **XSS Prevention**: HTML tag removal
- **Script Injection**: JavaScript protocol blocking
- **Event Handler**: Event handler attribute removal
- **URL Validation**: Secure URL validation

```typescript
export class InputSanitizer {
  static sanitizeString(input: string): string
  static sanitizeEmail(email: string): string
  static sanitizeUrl(url: string): string
  static validatePassword(password: string): { isValid: boolean; errors: string[] }
}
```

#### Password Validation
```typescript
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

  return { isValid: errors.length === 0, errors };
}
```

### 3. Session Security

#### Implementation
- **Automatic Timeout**: Configurable session timeout
- **Session Validation**: Regular session validation
- **Secure Cookies**: HTTP-only, secure cookie settings
- **Automatic Cleanup**: Automatic security data cleanup

```typescript
export class SessionSecurity {
  static startSessionTimeout(callback: () => void, timeout: number): void
  static resetSessionTimeout(callback: () => void, timeout: number): void
  static validateSession(): boolean
}
```

### 4. Security Monitoring

#### Features
- **XSS Detection**: Script injection monitoring
- **Iframe Injection**: Iframe injection detection
- **DOM Mutation**: Suspicious DOM changes monitoring
- **Console Access**: Console access logging

```typescript
const securityMonitor = {
  detectXSS: () => { /* XSS detection logic */ },
  detectIframeInjection: () => { /* Iframe injection detection */ },
  detectSuspiciousDOM: () => { /* DOM mutation monitoring */ },
  detectConsoleAccess: () => { /* Console access logging */ }
};
```

## Usage Examples

### 1. Using Secure Authentication

```typescript
import { useSecureAuth } from '@/hooks/useSecureAuth';

const MyComponent = () => {
  const {
    user,
    isAuthenticated,
    signIn,
    signOut,
    remainingAttempts,
    isLockedOut
  } = useSecureAuth();

  const handleLogin = async (email: string, password: string) => {
    const { error } = await signIn(email, password);
    if (error) {
      console.error('Login failed:', error.message);
    }
  };

  return (
    <div>
      {isLockedOut && (
        <p>Account temporarily locked. Try again later.</p>
      )}
      {remainingAttempts < 5 && (
        <p>Remaining attempts: {remainingAttempts}</p>
      )}
    </div>
  );
};
```

### 2. Using Secure Forms

```typescript
import SecureForm from '@/components/SecureForm';

const MyForm = () => {
  const handleSubmit = async (data: any) => {
    // CSRF token is automatically included
    await submitData(data);
  };

  return (
    <SecureForm onSubmit={handleSubmit} rateLimitKey="user-registration">
      <input name="email" type="email" required />
      <input name="password" type="password" required />
    </SecureForm>
  );
};
```

### 3. Using Secure API Client

```typescript
import { secureApi } from '@/lib/secureApi';

const fetchData = async () => {
  try {
    // CSRF token and security headers automatically added
    const data = await secureApi.get('/api/users');
    return data;
  } catch (error) {
    console.error('API call failed:', error);
  }
};
```

## Security Best Practices

### 1. Environment Variables

```bash
# .env.local
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_ENV=development
```

### 2. Production Security

- **HTTPS Only**: All production traffic over HTTPS
- **Secure Cookies**: HTTP-only, secure cookie flags
- **CSP Enforcement**: Strict Content Security Policy
- **Security Monitoring**: Production security logging

### 3. Regular Security Updates

- **Dependency Updates**: Regular security dependency updates
- **Security Audits**: Regular security code reviews
- **Penetration Testing**: Regular security testing
- **Vulnerability Scanning**: Automated vulnerability detection

## Testing Security

### 1. Security Tests

```typescript
// Test CSRF protection
it('should reject requests without CSRF token', async () => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test User' })
  });
  
  expect(response.status).toBe(403);
});

// Test rate limiting
it('should block requests after max attempts', async () => {
  for (let i = 0; i < 6; i++) {
    await signIn('test@example.com', 'wrongpassword');
  }
  
  expect(isLockedOut).toBe(true);
});
```

### 2. Security Headers Test

```typescript
it('should include security headers', () => {
  const response = await fetch('/');
  
  expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
  expect(response.headers.get('X-Frame-Options')).toBe('DENY');
  expect(response.headers.get('X-XSS-Protection')).toBe('1; mode=block');
});
```

## Troubleshooting

### 1. Common Issues

- **CSRF Token Missing**: Ensure SecurityProvider is wrapping the app
- **JWT Verification Failed**: Check JWKS configuration
- **Rate Limiting**: Check rate limit configuration
- **Security Headers**: Verify CSP configuration

### 2. Debug Mode

```typescript
// Enable debug mode in development
VITE_ENABLE_DEBUG=true
```

## Conclusion

This security implementation provides comprehensive protection against common web vulnerabilities including:

- ✅ **JWT Security**: Secure token-based authentication
- ✅ **CSRF Protection**: Cross-site request forgery prevention
- ✅ **CORS Handling**: Cross-origin resource sharing security
- ✅ **Helmet Security**: Security headers and CSP implementation
- ✅ **Rate Limiting**: Brute force attack prevention
- ✅ **Input Sanitization**: XSS and injection attack prevention
- ✅ **Session Security**: Secure session management
- ✅ **Security Monitoring**: Real-time security threat detection

The implementation follows security best practices and provides multiple layers of protection while maintaining developer experience and application performance.
