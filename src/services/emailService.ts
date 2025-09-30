// Email service for frontend
// Use environment variable for API URL, fallback based on domain
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  
  // Production domains - use same domain to avoid CORS
  if (hostname === 'sharedwealth.net' || 
      hostname === 'www.sharedwealth.net' || 
      hostname.includes('onrender.com')) {
    return `${protocol}//${hostname}/api`;
  }
  
  // Development - use localhost
  return 'http://localhost:8080/api';
};

const API_BASE_URL = getApiBaseUrl();

export interface EmailTemplate {
  name: string;
  subject: string;
  description: string;
}

export interface SendEmailRequest {
  to: string;
  subject: string;
  template?: string;
  templateData?: Record<string, any>;
  html?: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: string;
    contentType?: string;
  }>;
}

export interface SendWelcomeEmailRequest {
  email: string;
  name: string;
  verificationUrl?: string;
}

export interface SendPasswordResetEmailRequest {
  email: string;
  name: string;
  resetUrl: string;
  expiryHours?: number;
}

export interface SendCompanyApprovalEmailRequest {
  email: string;
  name: string;
  companyName: string;
}

export interface SendCompanyRejectionEmailRequest {
  email: string;
  name: string;
  companyName: string;
  reason?: string;
}

export interface SendNotificationEmailRequest {
  email: string;
  subject: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
}

class EmailService {
  private getAuthHeaders(): Headers {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    
    // Add auth token if available
    const session = localStorage.getItem('session');
    if (session) {
      try {
        const sessionData = JSON.parse(session);
        const token = sessionData.access_token || sessionData.session?.access_token;
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
      } catch (error) {
        console.error('Error parsing session from localStorage:', error);
      }
    }
    
    return headers;
  }

  /**
   * Send custom email
   */
  async sendEmail(data: SendEmailRequest): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/email/send`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(data: SendWelcomeEmailRequest): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/email/welcome`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(data: SendPasswordResetEmailRequest): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/email/password-reset`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
  }

  /**
   * Send company approval email
   */
  async sendCompanyApprovalEmail(data: SendCompanyApprovalEmailRequest): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/email/company-approval`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
  }

  /**
   * Send company rejection email
   */
  async sendCompanyRejectionEmail(data: SendCompanyRejectionEmailRequest): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/email/company-rejection`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
  }

  /**
   * Send notification email
   */
  async sendNotificationEmail(data: SendNotificationEmailRequest): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/email/notification`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
  }

  /**
   * Test email service
   */
  async testEmailService(): Promise<{ message: string; templates: string[] }> {
    const response = await fetch(`${API_BASE_URL}/email/test`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Get available email templates
   */
  async getEmailTemplates(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/email/templates`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data.templates;
  }

  /**
   * Validate email address
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Format email for display
   */
  formatEmailForDisplay(email: string): string {
    if (email.length > 30) {
      return email.substring(0, 27) + '...';
    }
    return email;
  }

  /**
   * Get email domain
   */
  getEmailDomain(email: string): string {
    const parts = email.split('@');
    return parts.length > 1 ? parts[1] : '';
  }

  /**
   * Check if email is from a common provider
   */
  isCommonEmailProvider(email: string): boolean {
    const commonProviders = [
      'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
      'icloud.com', 'aol.com', 'live.com', 'msn.com'
    ];
    
    const domain = this.getEmailDomain(email).toLowerCase();
    return commonProviders.includes(domain);
  }
}

export const emailService = new EmailService();
export default emailService;
