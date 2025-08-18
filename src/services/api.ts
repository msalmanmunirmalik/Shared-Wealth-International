const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const session = localStorage.getItem('session');
    if (session) {
      try {
        const sessionData = JSON.parse(session);
        const token = sessionData.access_token || sessionData.session?.access_token;
        if (token) {
          config.headers = {
            ...config.headers,
            'Authorization': `Bearer ${token}`,
          };
        }
      } catch (error) {
        console.error('Error parsing session from localStorage:', error);
      }
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async signIn(email: string, password: string) {
    const response = await this.request<{ session: any }>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return response;
  }

  async signUp(email: string, password: string) {
    return await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signOut() {
    return await this.request('/auth/signout', {
      method: 'POST',
    });
  }

  async resetPassword(email: string) {
    return await this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async isAdmin(userId: string): Promise<boolean> {
    try {
      const response = await this.request<{ isAdmin: boolean }>(`/auth/admin/check/${userId}`);
      return response.isAdmin;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  async isSuperAdmin(userId: string): Promise<boolean> {
    try {
      const response = await this.request<{ isSuperAdmin: boolean }>(`/auth/admin/super/${userId}`);
      return response.isSuperAdmin;
    } catch (error) {
      console.error('Error checking super admin status:', error);
      return false;
    }
  }

  // User methods
  async getCurrentUser() {
    return await this.request('/users/me');
  }

  async updateUser(userId: string, userData: any) {
    return await this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Company methods
  async getCompanies() {
    return await this.request('/companies');
  }

  async getCompany(companyId: string) {
    return await this.request(`/companies/${companyId}`);
  }

  async createCompany(companyData: any) {
    return await this.request('/companies', {
      method: 'POST',
      body: JSON.stringify(companyData),
    });
  }

  async updateCompany(companyId: string, companyData: any) {
    return await this.request(`/companies/${companyId}`, {
      method: 'PUT',
      body: JSON.stringify(companyData),
    });
  }

  async deleteCompany(companyId: string) {
    return await this.request(`/companies/${companyId}`, {
      method: 'DELETE',
    });
  }

  // Network methods
  async getNetworkCompanies() {
    return await this.request('/network');
  }

  async addCompanyToNetwork(companyId: string) {
    return await this.request('/network', {
      method: 'POST',
      body: JSON.stringify({ companyId }),
    });
  }

  // Funding methods
  async getFundingOpportunities() {
    return await this.request('/funding');
  }

  async applyForFunding(fundingId: string, applicationData: any) {
    return await this.request(`/funding/${fundingId}/apply`, {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  }

  // Forum methods
  async getForumPosts() {
    return await this.request('/forum');
  }

  async createForumPost(postData: any) {
    return await this.request('/forum', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  // Events methods
  async getEvents() {
    return await this.request('/events');
  }

  async createEvent(eventData: any) {
    return await this.request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  // Messaging methods
  async getMessages() {
    return await this.request('/messaging');
  }

  async sendMessage(messageData: any) {
    return await this.request('/messaging', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  // Admin methods
  async getAdminStats() {
    return await this.request('/admin/stats');
  }

  async getAdminUsers() {
    return await this.request('/admin/users');
  }

  async updateUserRole(userId: string, role: string) {
    return await this.request(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }
}

export const apiService = new ApiService();
export default apiService;
