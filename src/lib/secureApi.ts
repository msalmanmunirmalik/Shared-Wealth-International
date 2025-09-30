import { supabase } from '@/integrations/supabase/client';
import { 
  CSRFProtection, 
  JWTSecurity, 
  RateLimiter, 
  InputSanitizer,
  CookieSecurity,
  SECURITY_CONFIG 
} from './security';

// API configuration
const API_CONFIG = {
  baseURL: import.meta.env.VITE_SUPABASE_URL || 'https://ewqwjduvjkddknpqpmfr.supabase.co',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
} as const;

// Request interceptor for adding security headers
const addSecurityHeaders = (headers: Headers): void => {
  // Add CSRF token
  const csrfToken = CSRFProtection.getToken();
  if (csrfToken) {
    headers.set(SECURITY_CONFIG.CSRF_HEADER_NAME, csrfToken);
  }

  // Add security headers
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
};

// Response interceptor for security validation
const validateResponse = async (response: Response): Promise<Response> => {
  // Check for security headers
  const securityHeaders = [
    'X-Content-Type-Options',
    'X-Frame-Options',
    'X-XSS-Protection',
  ];

  securityHeaders.forEach(header => {
    if (!response.headers.get(header)) {
      console.warn(`Missing security header: ${header}`);
    }
  });

  // Validate CORS
  if (response.headers.get('Access-Control-Allow-Origin') === '*') {
    console.warn('CORS policy allows all origins - security risk');
  }

  return response;
};

// Retry mechanism with exponential backoff
const retryRequest = async (
  requestFn: () => Promise<Response>,
  attempts: number = API_CONFIG.retryAttempts
): Promise<Response> => {
  try {
    return await requestFn();
  } catch (error) {
    if (attempts <= 1) throw error;
    
    await new Promise(resolve => 
      setTimeout(resolve, API_CONFIG.retryDelay * (API_CONFIG.retryAttempts - attempts + 1))
    );
    
    return retryRequest(requestFn, attempts - 1);
  }
};

// Secure API client class
export class SecureApiClient {
  private static instance: SecureApiClient;
  private csrfToken: string | null = null;

  private constructor() {
    this.initializeCSRF();
  }

  static getInstance(): SecureApiClient {
    if (!SecureApiClient.instance) {
      SecureApiClient.instance = new SecureApiClient();
    }
    return SecureApiClient.instance;
  }

  private initializeCSRF(): void {
    this.csrfToken = CSRFProtection.createToken();
  }

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

  private async validateRequest(data: any): Promise<any> {
    if (typeof data === 'string') {
      return InputSanitizer.sanitizeString(data);
    }

    if (typeof data === 'object' && data !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'string') {
          sanitized[key] = InputSanitizer.sanitizeString(value);
        } else if (typeof value === 'object' && value !== null) {
          sanitized[key] = await this.validateRequest(value);
        } else {
          sanitized[key] = value;
        }
      }
      return sanitized;
    }

    return data;
  }

  private async handleRateLimit(identifier: string): Promise<boolean> {
    if (!RateLimiter.checkRateLimit(identifier)) {
      throw new Error(`Rate limit exceeded. Try again in ${SECURITY_CONFIG.LOCKOUT_DURATION / 1000} seconds.`);
    }
    return true;
  }

  async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const identifier = `GET:${endpoint}`;
    await this.handleRateLimit(identifier);

    const headers = await this.getAuthHeaders();
    const url = `${API_CONFIG.baseURL}${endpoint}`;

    const requestFn = () => fetch(url, {
      method: 'GET',
      headers,
      ...options,
    });

    const response = await retryRequest(requestFn);
    await validateResponse(response);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    RateLimiter.resetAttempts(identifier);
    return response.json();
  }

  async post<T>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> {
    const identifier = `POST:${endpoint}`;
    await this.handleRateLimit(identifier);

    const headers = await this.getAuthHeaders();
    const url = `${API_CONFIG.baseURL}${endpoint}`;
    
    // Validate and sanitize input data
    const sanitizedData = await this.validateRequest(data);

    const requestFn = () => fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(sanitizedData),
      ...options,
    });

    const response = await retryRequest(requestFn);
    await validateResponse(response);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    RateLimiter.resetAttempts(identifier);
    return response.json();
  }

  async put<T>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> {
    const identifier = `PUT:${endpoint}`;
    await this.handleRateLimit(identifier);

    const headers = await this.getAuthHeaders();
    const url = `${API_CONFIG.baseURL}${endpoint}`;
    
    // Validate and sanitize input data
    const sanitizedData = await this.validateRequest(data);

    const requestFn = () => fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(sanitizedData),
      ...options,
    });

    const response = await retryRequest(requestFn);
    await validateResponse(response);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    RateLimiter.resetAttempts(identifier);
    return response.json();
  }

  async delete<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const identifier = `DELETE:${endpoint}`;
    await this.handleRateLimit(identifier);

    const headers = await this.getAuthHeaders();
    const url = `${API_CONFIG.baseURL}${endpoint}`;

    const requestFn = () => fetch(url, {
      method: 'DELETE',
      headers,
      ...options,
    });

    const response = await retryRequest(requestFn);
    await validateResponse(response);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    RateLimiter.resetAttempts(identifier);
    return response.json();
  }

  async upload<T>(endpoint: string, file: File, options: RequestInit = {}): Promise<T> {
    const identifier = `UPLOAD:${endpoint}`;
    await this.handleRateLimit(identifier);

    const headers = await this.getAuthHeaders();
    // Remove Content-Type for file uploads
    headers.delete('Content-Type');
    
    const url = `${API_CONFIG.baseURL}${endpoint}`;

    const formData = new FormData();
    formData.append('file', file);

    const requestFn = () => fetch(url, {
      method: 'POST',
      headers,
      body: formData,
      ...options,
    });

    const response = await retryRequest(requestFn);
    await validateResponse(response);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    RateLimiter.resetAttempts(identifier);
    return response.json();
  }

  // Refresh CSRF token
  refreshCSRFToken(): void {
    this.csrfToken = CSRFProtection.createToken();
  }

  // Clear all security data
  clearSecurityData(): void {
    this.csrfToken = null;
    CSRFProtection.clearToken();
    CookieSecurity.clearAllCookies();
  }
}

// Export singleton instance
export const secureApi = SecureApiClient.getInstance();

// Export types for API responses
export interface ApiResponse<T> {
  data: T;
  error: string | null;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Utility function for handling API errors
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};
