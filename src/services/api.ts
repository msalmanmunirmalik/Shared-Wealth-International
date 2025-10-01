// Use environment variable for API URL, fallback based on domain
// For production domains, use the same domain to avoid CORS issues
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

// Debug logging for API URL
console.log('🔗 API Debug - Hostname:', window.location.hostname);
console.log('🔗 API Debug - API Base URL:', API_BASE_URL);

class ApiService {
  private isDemoMode(): boolean {
    return localStorage.getItem('isDemoMode') === 'true';
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // If in demo mode, return mock data for certain endpoints
    if (this.isDemoMode()) {
      return this.getMockData<T>(endpoint, options);
    }

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
          console.log('🔐 API Debug - Token added to request:', token.substring(0, 20) + '...');
        } else {
          console.log('🔐 API Debug - No token found in session data:', sessionData);
        }
      } catch (error) {
        console.error('Error parsing session from localStorage:', error);
      }
    } else {
      console.log('🔐 API Debug - No session found in localStorage');
    }

    try {
      console.log('🔐 API Debug - Making request to:', url);
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('🔐 API Debug - Request failed:', response.status, errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('🔐 API Debug - Request successful:', data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private async getMockData<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Mock data for demo mode
    const mockData: Record<string, any> = {
      '/auth/signin': { session: { user: { id: 'demo-user-123', email: 'demo@sharedwealth.com', role: 'user' }, access_token: 'demo-token-123' } },
      '/auth/signup': { message: 'Demo mode - signup simulated' },
      '/users/logout': { message: 'Demo mode - logout simulated' },
      '/auth/reset-password': { message: 'Demo mode - password reset simulated' },
      '/auth/admin/check/demo-user-123': false,
      '/users/profile': { id: 'demo-user-123', email: 'demo@sharedwealth.com', role: 'user', created_at: new Date().toISOString() },
      '/companies': { companies: [], total: 0 },
      '/companies/dashboard': { 
        userCompanies: [
          {
            id: 'demo-company-1',
            name: 'Demo Shared Wealth Company',
            industry: 'Technology',
            location: 'San Francisco, CA',
            highlights: 'Leading the way in equitable tech solutions',
            revenue: 2500000,
            employees: 45,
            shared_wealth_score: 85,
            created_at: new Date().toISOString()
          }
        ],
        networkCompanies: [
          {
            id: 'demo-network-1',
            name: 'EcoTech Solutions',
            industry: 'Clean Energy',
            location: 'Portland, OR',
            highlights: 'Sustainable energy for all communities',
            revenue: 1800000,
            employees: 32,
            shared_wealth_score: 92,
            created_at: new Date().toISOString()
          },
          {
            id: 'demo-network-2',
            name: 'Community First Bank',
            industry: 'Financial Services',
            location: 'Austin, TX',
            highlights: 'Banking that serves the community',
            revenue: 3200000,
            employees: 78,
            shared_wealth_score: 88,
            created_at: new Date().toISOString()
          }
        ]
      }
    };

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const mockResponse = mockData[endpoint];
    if (mockResponse) {
      return mockResponse as T;
    }

    // Default mock response for unknown endpoints
    return { message: 'Demo mode - endpoint not configured', endpoint } as T;
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

  async signUpWithProfile(profileData: any) {
    try {
      // If profile image is provided, upload it first
      let profileImageUrl = '';
      if (profileData.profileImage) {
        try {
          const formData = new FormData();
          formData.append('file', profileData.profileImage);
          formData.append('uploadType', 'images');
          
          const uploadResponse = await fetch(`${API_BASE_URL}/files/upload`, {
            method: 'POST',
            // Don't set Content-Type for FormData - let browser set it with boundary
            body: formData,
          });

          if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json();
            profileImageUrl = uploadData.data?.publicUrl || '';
          }
        } catch (uploadError) {
          console.warn('Profile image upload failed:', uploadError);
          // Continue without profile image
        }
      }

      // Create user account with all profile data in one request
      const userResponse = await this.request('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: profileData.email,
          password: profileData.password,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phone: profileData.phone,
          role: 'user', // Default role for all new users
          selectedCompanyId: profileData.selectedCompanyId,
          position: profileData.position,
          companyName: profileData.companyName,
          bio: profileData.bio,
          location: profileData.location,
          website: profileData.website,
          linkedin: profileData.linkedin,
          twitter: profileData.twitter,
          profileImage: profileImageUrl
        }),
      });

      return userResponse;
    } catch (error) {
      console.error('Enhanced signup error:', error);
      throw error;
    }
  }

  async signOut() {
    return await this.request('/users/logout', {
      method: 'POST',
    });
  }

  async getUserProfile() {
    return await this.request('/users/profile', {
      method: 'GET',
    });
  }

  async updateUserProfile(profileData: any) {
    return await this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }


  async getTeamMembers(role?: string) {
    const url = role ? `/users/team?role=${role}` : '/users/team';
    return await this.request(url, {
      method: 'GET',
    });
  }


  async isAdmin(userId: string): Promise<boolean> {
    try {
      const response = await this.request<{ success: boolean; isAdmin: boolean }>(`/auth/admin/check/${userId}`);
      return response.success && response.isAdmin;
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


  // Company methods
  async getCompanies() {
    return await this.request('/companies');
  }

  async getUserCompanies() {
    return await this.request('/companies/user');
  }

  async getUserApplications() {
    return await this.request('/companies/applications');
  }

  // Network methods
  async getUserNetwork() {
    return await this.request('/networks/user');
  }

  async addToNetwork(companyId: string, connectionType: string = 'member', notes?: string) {
    return await this.request('/networks/add', {
      method: 'POST',
      body: JSON.stringify({ 
        company_id: companyId, 
        connection_type: connectionType,
        notes: notes 
      })
    });
  }

  async removeFromNetwork(companyId: string) {
    return await this.request('/networks/remove', {
      method: 'DELETE',
      body: JSON.stringify({ company_id: companyId })
    });
  }

  async getAvailableCompanies(searchTerm?: string) {
    const url = searchTerm ? `/networks/available?search=${encodeURIComponent(searchTerm)}` : '/networks/available';
    return await this.request(url);
  }

  async getCompany(companyId: string) {
    return await this.request(`/companies/${companyId}`);
  }

  // Unified Content API methods (replaces company news)
  async getAllContent(filters?: {
    type?: string;
    author_id?: string;
    company_id?: string;
    is_published?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return await this.request(`/content${queryString}`);
  }

  async getContentById(contentId: string) {
    return await this.request(`/content/${contentId}`);
  }

  async createContent(contentData: any) {
    return await this.request('/content', {
      method: 'POST',
      body: JSON.stringify(contentData)
    });
  }

  async updateContent(contentId: string, updateData: any) {
    return await this.request(`/content/${contentId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  }

  async deleteContent(contentId: string) {
    return await this.request(`/content/${contentId}`, {
      method: 'DELETE'
    });
  }

  async getContentByCompany(companyId: string, filters?: { type?: string; limit?: number; offset?: number }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return await this.request(`/content/company/${companyId}${queryString}`);
  }

  async getContentByUser(userId: string, filters?: { type?: string; limit?: number; offset?: number }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return await this.request(`/content/user/${userId}${queryString}`);
  }

  async toggleContentPublishStatus(contentId: string, isPublished: boolean) {
    return await this.request(`/content/${contentId}/publish`, {
      method: 'PATCH',
      body: JSON.stringify({ is_published: isPublished })
    });
  }

  // Unified Social API methods (replaces separate social APIs)
  async addReaction(contentId: string, reactionType: string, contentType: string) {
    return await this.request(`/social/reactions/${contentId}`, {
      method: 'POST',
      body: JSON.stringify({ reaction_type: reactionType, content_type: contentType })
    });
  }

  async removeReaction(contentId: string, reactionType: string, contentType: string) {
    return await this.request(`/social/reactions/${contentId}`, {
      method: 'DELETE',
      body: JSON.stringify({ reaction_type: reactionType, content_type: contentType })
    });
  }

  async getReactions(contentId: string, contentType: string) {
    return await this.request(`/social/reactions/${contentId}?content_type=${contentType}`);
  }

  async followUser(targetUserId: string, connectionType: string = 'follow') {
    return await this.request(`/social/follow/${targetUserId}`, {
      method: 'POST',
      body: JSON.stringify({ connection_type: connectionType })
    });
  }

  async unfollowUser(targetUserId: string) {
    return await this.request(`/social/follow/${targetUserId}`, {
      method: 'DELETE'
    });
  }

  async getConnections(userId: string, filters?: { type?: string; limit?: number; offset?: number }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return await this.request(`/social/connections/${userId}${queryString}`);
  }

  async getConnectionStats(userId: string) {
    return await this.request(`/social/connections/${userId}/stats`);
  }

  async shareContent(contentId: string, shareType: string, platform: string, message?: string) {
    return await this.request(`/social/share/${contentId}`, {
      method: 'POST',
      body: JSON.stringify({ share_type: shareType, platform, message })
    });
  }

  async getSharedContent(userId: string, filters?: { platform?: string; limit?: number; offset?: number }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return await this.request(`/social/shares/${userId}${queryString}`);
  }

  async bookmarkContent(contentId: string, contentType: string) {
    return await this.request(`/social/bookmark/${contentId}`, {
      method: 'POST',
      body: JSON.stringify({ content_type: contentType })
    });
  }

  async removeBookmark(contentId: string) {
    return await this.request(`/social/bookmark/${contentId}`, {
      method: 'DELETE'
    });
  }

  async getBookmarks(userId: string, filters?: { content_type?: string; limit?: number; offset?: number }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return await this.request(`/social/bookmarks/${userId}${queryString}`);
  }

  async getSocialAnalytics(userId: string, period: string = '30d') {
    return await this.request(`/social/analytics/${userId}?period=${period}`);
  }

  async getSocialFeed(filters?: { limit?: number; offset?: number; type?: string }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return await this.request(`/social/feed${queryString}`);
  }

  // Unified Dashboard API methods (replaces separate dashboard APIs)
  async getDashboard(filters?: { sections?: string; period?: string }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return await this.request(`/dashboard${queryString}`);
  }

  async getUserDashboard(userId: string, period?: string) {
    const queryString = period ? `?period=${period}` : '';
    return await this.request(`/dashboard/user/${userId}${queryString}`);
  }

  async getCompanyDashboard(companyId: string, period?: string) {
    const queryString = period ? `?period=${period}` : '';
    return await this.request(`/dashboard/company/${companyId}${queryString}`);
  }

  async getAdminDashboard(period?: string) {
    const queryString = period ? `?period=${period}` : '';
    return await this.request(`/dashboard/admin${queryString}`);
  }

  async getDashboardAnalytics(filters?: { type?: string; period?: string; entityId?: string; entityType?: string }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return await this.request(`/dashboard/analytics${queryString}`);
  }

  async getDashboardWidgets(dashboardType?: string) {
    const queryString = dashboardType ? `?dashboardType=${dashboardType}` : '';
    return await this.request(`/dashboard/widgets${queryString}`);
  }

  async updateDashboardWidgets(widgets: any[]) {
    return await this.request('/dashboard/widgets', {
      method: 'PUT',
      body: JSON.stringify({ widgets })
    });
  }

  async getDashboardNotifications(filters?: { limit?: number; offset?: number; type?: string }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return await this.request(`/dashboard/notifications${queryString}`);
  }

  async markNotificationRead(notificationId: string) {
    return await this.request(`/dashboard/notifications/${notificationId}/read`, {
      method: 'PATCH'
    });
  }

  async getActivityFeed(filters?: { limit?: number; offset?: number; type?: string }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return await this.request(`/dashboard/activity${queryString}`);
  }

  // Unified File API methods (replaces separate file APIs)
  async uploadFile(fileData: FormData) {
    return await this.request('/files/upload', {
      method: 'POST',
      body: fileData
    });
  }

  async uploadMultipleFiles(fileData: FormData) {
    return await this.request('/files/upload/multiple', {
      method: 'POST',
      body: fileData
    });
  }

  async getFile(fileId: string) {
    return await this.request(`/files/${fileId}`);
  }

  async downloadFile(fileId: string) {
    return await this.request(`/files/${fileId}/download`);
  }

  async getFilesByContext(context: string, contextId: string, filters?: { limit?: number; offset?: number; type?: string; search?: string }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return await this.request(`/files/context/${context}/${contextId}${queryString}`);
  }

  async getUserFiles(userId: string, filters?: { limit?: number; offset?: number; type?: string; search?: string }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return await this.request(`/files/user/${userId}${queryString}`);
  }

  async updateFile(fileId: string, updateData: { description?: string; tags?: string[]; isPublic?: boolean }) {
    return await this.request(`/files/${fileId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  }

  async deleteFile(fileId: string) {
    return await this.request(`/files/${fileId}`, {
      method: 'DELETE'
    });
  }

  async shareFile(fileId: string, shareData: { shareType: string; recipients?: string[]; message?: string; expiresAt?: string }) {
    return await this.request(`/files/${fileId}/share`, {
      method: 'POST',
      body: JSON.stringify(shareData)
    });
  }

  async getFileShares(fileId: string) {
    return await this.request(`/files/${fileId}/shares`);
  }

  async getFileAnalytics(fileId: string) {
    return await this.request(`/files/${fileId}/analytics`);
  }

  async getStorageStats() {
    return await this.request('/files/storage/stats');
  }

  // Unified User API methods (replaces separate user/auth APIs)
  async register(userData: { email: string; password: string; firstName: string; lastName: string; role?: string }) {
    return await this.request('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async login(email: string, password: string) {
    return await this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async logout() {
    return await this.request('/users/logout', {
      method: 'POST'
    });
  }

  async getProfile() {
    return await this.request('/users/profile');
  }

  async updateProfile(profileData: { firstName?: string; lastName?: string; bio?: string; avatar?: string; preferences?: any }) {
    return await this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return await this.request('/users/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword })
    });
  }

  async getUser(userId: string) {
    return await this.request(`/users/${userId}`);
  }

  async getAllUsers(filters?: { limit?: number; offset?: number; search?: string; role?: string; status?: string }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return await this.request(`/users${queryString}`);
  }

  async updateUser(userId: string, updateData: { firstName?: string; lastName?: string; email?: string; role?: string; status?: string; bio?: string; avatar?: string }) {
    return await this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  }

  async deleteUser(userId: string) {
    return await this.request(`/users/${userId}`, {
      method: 'DELETE'
    });
  }

  async getUserStats(userId: string) {
    return await this.request(`/users/${userId}/stats`);
  }

  async getUserActivity(userId: string, filters?: { limit?: number; offset?: number; type?: string }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return await this.request(`/users/${userId}/activity${queryString}`);
  }

  async verifyEmail(token: string) {
    return await this.request(`/users/verify-email/${token}`);
  }

  async requestPasswordReset(email: string) {
    return await this.request('/users/request-password-reset', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  async resetPassword(token: string, newPassword: string) {
    return await this.request(`/users/reset-password/${token}`, {
      method: 'POST',
      body: JSON.stringify({ newPassword })
    });
  }


  // Network methods
  async getNetworkCompanies() {
    return await this.request('/network');
  }

  async addCompanyToNetwork(companyId: string, connectionType: string = 'member', notes?: string) {
    return await this.request('/networks/add', {
      method: 'POST',
      body: JSON.stringify({ 
        company_id: companyId,
        connection_type: connectionType,
        notes: notes
      }),
    });
  }

  // Messaging methods (legacy - use realtime methods below)
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

  async createUser(email: string, password: string, role: string = 'user') {
    return await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
  }


  async createCompany(companyData: any) {
    return await this.request('/companies', {
      method: 'POST',
      body: JSON.stringify(companyData),
    });
  }

  async deleteCompany(companyId: string) {
    return await this.request(`/companies/${companyId}`, {
      method: 'DELETE',
    });
  }

  async approveCompany(companyId: string) {
    return await this.request(`/admin/companies/${companyId}/approve`, {
      method: 'POST',
    });
  }

  async rejectCompany(companyId: string) {
    return await this.request(`/admin/companies/${companyId}/reject`, {
      method: 'POST',
    });
  }

  async sendCredentials(email: string, password: string) {
    // This would typically call an email service
    // For now, we'll simulate it
    return await this.request('/admin/send-credentials', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Admin Analytics Methods
  async getAnalytics() {
    return await this.request('/admin/analytics', {
      method: 'GET',
    });
  }

  async getAuditLog(params?: { page?: number; limit?: number; action?: string; userId?: string; dateFrom?: string; dateTo?: string }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/admin/audit-log${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await this.request(endpoint, {
      method: 'GET',
    });
  }

  // Content Management Methods
  // Funding Opportunities
  async getFundingOpportunities(params?: { page?: number; limit?: number }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/admin/content/funding-opportunities${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await this.request(endpoint, {
      method: 'GET',
    });
  }

  async createFundingOpportunity(data: {
    title: string;
    category: string;
    description: string;
    amount?: string;
    deadline?: string;
    eligibility?: string;
    url?: string;
    status?: 'active' | 'inactive' | 'expired';
  }) {
    return await this.request('/admin/content/funding-opportunities', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateFundingOpportunity(id: string, data: any) {
    return await this.request(`/admin/content/funding-opportunities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteFundingOpportunity(id: string) {
    return await this.request(`/admin/content/funding-opportunities/${id}`, {
      method: 'DELETE',
    });
  }

  // News Articles
  async getNewsArticles(params?: { page?: number; limit?: number }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/admin/content/news-articles${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await this.request(endpoint, {
      method: 'GET',
    });
  }

  async createNewsArticle(data: {
    title: string;
    content: string;
    category: string;
    author?: string;
    status?: 'draft' | 'published' | 'archived';
  }) {
    return await this.request('/admin/content/news-articles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateNewsArticle(id: string, data: any) {
    return await this.request(`/admin/content/news-articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteNewsArticle(id: string) {
    return await this.request(`/admin/content/news-articles/${id}`, {
      method: 'DELETE',
    });
  }

  // Events
  async getEvents(params?: { page?: number; limit?: number }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/admin/content/events${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await this.request(endpoint, {
      method: 'GET',
    });
  }

  async createEvent(data: {
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    location?: string;
    max_participants?: number;
    status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  }) {
    return await this.request('/admin/content/events', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEvent(id: string, data: any) {
    return await this.request(`/admin/content/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEvent(id: string) {
    return await this.request(`/admin/content/events/${id}`, {
      method: 'DELETE',
    });
  }

  // System Monitoring Methods
  async getSystemHealth() {
    return await this.request('/admin/monitoring/system-health', {
      method: 'GET',
    });
  }

  async getPerformanceMetrics() {
    return await this.request('/admin/monitoring/performance', {
      method: 'GET',
    });
  }

  async getDatabaseMetrics() {
    return await this.request('/admin/monitoring/database', {
      method: 'GET',
    });
  }

  async getSecurityEvents(limit?: number) {
    const endpoint = `/admin/monitoring/security${limit ? `?limit=${limit}` : ''}`;
    return await this.request(endpoint, {
      method: 'GET',
    });
  }

  async getSystemLogs(limit?: number) {
    const endpoint = `/admin/monitoring/logs${limit ? `?limit=${limit}` : ''}`;
    return await this.request(endpoint, {
      method: 'GET',
    });
  }

  async getDiskUsage() {
    return await this.request('/admin/monitoring/disk-usage', {
      method: 'GET',
    });
  }

  // Enhanced Funding Management Methods
  async getFundingApplications(params?: { page?: number; limit?: number; status?: string; opportunity_id?: string; applicant_id?: string }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/admin/funding/applications${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await this.request(endpoint, {
      method: 'GET',
    });
  }

  async getFundingApplicationById(id: string) {
    return await this.request(`/admin/funding/applications/${id}`, {
      method: 'GET',
    });
  }

  async createFundingApplication(data: {
    opportunity_id: string;
    applicant_id: string;
    company_id: string;
    application_data: any;
  }) {
    return await this.request('/admin/funding/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateFundingApplication(id: string, data: any) {
    return await this.request(`/admin/funding/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async approveFundingApplication(id: string, fundingAmount: number, reviewNotes?: string) {
    return await this.request(`/admin/funding/applications/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ funding_amount: fundingAmount, review_notes: reviewNotes }),
    });
  }

  async rejectFundingApplication(id: string, rejectionReason: string) {
    return await this.request(`/admin/funding/applications/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ rejection_reason: rejectionReason }),
    });
  }

  async deleteFundingApplication(id: string) {
    return await this.request(`/admin/funding/applications/${id}`, {
      method: 'DELETE',
    });
  }

  async getFundingOpportunitiesWithStats(params?: { page?: number; limit?: number }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/admin/funding/opportunities-with-stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await this.request(endpoint, {
      method: 'GET',
    });
  }

  async getFundingAnalytics() {
    return await this.request('/admin/funding/analytics', {
      method: 'GET',
    });
  }

  async uploadLogo(file: File, companyId?: string) {
    const formData = new FormData();
    formData.append('logo', file);
    
    if (companyId) {
      formData.append('companyId', companyId);
    }

    return this.request('/files/upload-logo', {
      method: 'POST',
      headers: {}, // Don't set Content-Type, let browser set it for FormData
      body: formData
    });
  }

  async uploadDocument(file: File, documentType?: string) {
    const formData = new FormData();
    formData.append('document', file);
    
    if (documentType) {
      formData.append('documentType', documentType);
    }

    return this.request('/files/upload-document', {
      method: 'POST',
      headers: {}, // Don't set Content-Type, let browser set it for FormData
      body: formData
    });
  }

  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    return this.request('/files/upload-image', {
      method: 'POST',
      headers: {}, // Don't set Content-Type, let browser set it for FormData
      body: formData
    });
  }


  getFileUrl(filename: string, type: string = 'general') {
    return `${API_BASE_URL}/files/serve/${filename}?type=${type}`;
  }


  async getUnreadCount() {
    return this.request('/realtime/unread-count');
  }

  async getConversations() {
    return this.request('/realtime/conversations');
  }

  async sendNotification(userId: string, type: string, title: string, message: string, data?: Record<string, any>) {
    return this.request('/realtime/send-notification', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        type,
        title,
        message,
        data
      })
    });
  }

  async getNotifications(limit?: number, offset?: number) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    
    return this.request(`/realtime/notifications?${params.toString()}`);
  }


  async getOnlineUsers() {
    return this.request('/realtime/online-users');
  }

  async broadcastMessage(event: string, data: Record<string, any>) {
    return this.request('/realtime/broadcast', {
      method: 'POST',
      body: JSON.stringify({
        event,
        data
      })
    });
  }

  /**
   * Dashboard methods
   */
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  async getRecentActivities(limit?: number) {
    const params = limit ? `?limit=${limit}` : '';
    return this.request(`/dashboard/activities${params}`);
  }

  async getUserProjects() {
    return this.request('/dashboard/projects');
  }

  async getUserMeetings() {
    return this.request('/dashboard/meetings');
  }

  async getPlatformStats() {
    return this.request('/dashboard/platform-stats');
  }


  async getReactionStats(postId: string, postType: string, userId?: string) {
    const params = userId ? `?userId=${userId}` : '';
    return this.request(`/reactions/${postId}/${postType}/stats${params}`);
  }

  async getPostReactions(postId: string, postType: string, limit?: number, offset?: number) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/reactions/${postId}/${postType}/list${queryString}`);
  }

  async getUserReactions(limit?: number, offset?: number) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/reactions/user${queryString}`);
  }


  async getFollowers(userId: string, limit?: number, offset?: number) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/connections/${userId}/followers${queryString}`);
  }

  async getFollowing(userId: string, limit?: number, offset?: number) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/connections/${userId}/following${queryString}`);
  }


  async getMutualConnections(userId1: string, userId2: string, limit?: number, offset?: number) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/connections/${userId1}/${userId2}/mutual${queryString}`);
  }

  async getSuggestedUsers(limit?: number) {
    const params = limit ? `?limit=${limit}` : '';
    return this.request(`/connections/suggested${params}`);
  }


  async getShareStats(contentId: string, contentType: string, userId?: string) {
    const params = userId ? `?userId=${userId}` : '';
    return this.request(`/sharing/${contentId}/${contentType}/stats${params}`);
  }

  async getContentShares(contentId: string, contentType: string, limit?: number, offset?: number) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/sharing/${contentId}/${contentType}/shares${queryString}`);
  }

  async getUserShares(limit?: number, offset?: number) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/sharing/user${queryString}`);
  }

  async generateShareableLink(contentId: string, contentType: string, platform: string = 'internal') {
    return this.request(`/sharing/${contentId}/${contentType}/link?platform=${platform}`);
  }

  async getTrendingSharedContent(limit?: number, timeframe?: string) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (timeframe) params.append('timeframe', timeframe);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/sharing/trending${queryString}`);
  }

  // Activities API methods
  async getActivities(userId: string, limit?: number, offset?: number) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/dashboard/activities${queryString}`);
  }
}

export const apiService = new ApiService();
export default apiService;
