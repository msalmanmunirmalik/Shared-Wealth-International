// Mock services for frontend development
// These will be replaced with real API calls when the backend is ready

export const mockAuthService = {
  signIn: async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'admin@sharedwealth.com' && password === 'admin123') {
      return {
        session: {
          user: {
            id: 'admin-123',
            email: 'admin@sharedwealth.com',
            role: 'admin',
            created_at: new Date().toISOString()
          },
          access_token: 'mock-admin-token'
        }
      };
    }
    
    throw new Error('Invalid credentials');
  },

  signUp: async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: 'Account created successfully' };
  },

  signOut: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },

  resetPassword: async (email: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: 'Password reset email sent' };
  },

  isAdmin: async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return userId === 'admin-123';
  }
};

export const mockCompanyService = {
  getCompanies: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return []; // Return empty array - no mock companies
  },

  createCompany: async (companyData: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, company: { id: 'new-company-id', ...companyData } };
  }
};

export const mockNetworkService = {
  getNetworkCompanies: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return []; // Return empty array - no mock companies
  }
};

export const mockFundingService = {
  getFundingOpportunities: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      {
        id: '1',
        title: 'Building a Long-Term Africa Union (AU) and European Union (EU) Research and Innovation joint collaboration on Sustainable Renewable Energies',
        category: 'HORIZON-CL5-2025-02-D3-15',
        description: 'Sustainable renewable energy research collaboration between AU and EU',
        amount: '€5,000,000',
        deadline: '2025-06-30',
        eligibility: 'Research institutions, technology companies',
        url: 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/horizon-cl5-2025-02-d3-15'
      },
      {
        id: '2',
        title: 'Overcoming the barriers for scaling up circular water management in agriculture',
        category: 'HORIZON-CL6-2025-02-FARM2FORK-03',
        description: 'Circular water management solutions for agricultural sustainability',
        amount: '€3,500,000',
        deadline: '2025-07-15',
        eligibility: 'Agricultural companies, water management firms',
        url: 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/horizon-cl6-2025-02-farm2fork-03'
      }
    ];
  }
};

// Add missing services that the frontend expects
export const CompanyDashboardService = {
  getDashboardStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      totalCompanies: 0,
      networkPartners: 0,
      growthRate: 0,
      activeProjects: 21,
      pendingApplications: 8,
      approvedCompanies: 8
    };
  },
  
  getCompanyDashboardData: async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      userCompanies: [], // Return empty array - no mock companies
      networkCompanies: [] // Return empty array - no mock companies
    };
  }
};

export const NetworkService = {
  getNetworkCompanies: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      {
        id: '1',
        name: 'Letstern Limited',
        description: 'Innovative technology solutions for sustainable development',
        industry: 'Technology',
        size: 'medium',
        location: 'London, UK',
        website: 'https://letstern.com',
        status: 'approved',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00Z',
        connection_strength: 85,
        shared_projects: 3,
        collaboration_score: 92
      }
    ];
  }
};
