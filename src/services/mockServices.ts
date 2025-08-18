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
        updated_at: '2024-01-15T10:00:00Z'
      }
    ];
  },

  createCompany: async (companyData: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, company: { id: 'new-company-id', ...companyData } };
  }
};

export const mockNetworkService = {
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
        updated_at: '2024-01-15T10:00:00Z',
        connection_strength: 85,
        shared_projects: 3,
        collaboration_score: 92
      }
    ];
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
      userCompanies: [
        {
          id: '1',
          company_name: 'Letstern Limited',
          sector: 'Technology',
          country: 'United Kingdom',
          description: 'Innovative technology solutions for sustainable development',
          website: 'https://letstern.com',
          employees: 50,
          is_shared_wealth_licensed: true,
          license_number: 'SWL-2024-001',
          license_date: '2024-01-15',
          status: 'active',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z'
        }
      ],
      networkCompanies: [
        {
          id: '2',
          name: 'EcoTech Solutions',
          sector: 'Clean Energy',
          country: 'Germany',
          description: 'Sustainable energy solutions for urban development',
          website: 'https://ecotech.de',
          employees: 25,
          is_shared_wealth_licensed: true,
          license_number: 'SWL-2024-002',
          license_date: '2024-01-20',
          status: 'active',
          created_at: '2024-01-20T10:00:00Z',
          updated_at: '2024-01-20T10:00:00Z',
          impact_score: 85,
          shared_value: 'High',
          joined_date: '2024-01-20T10:00:00Z',
          logo: '',
          contact_email: 'contact@ecotech.de',
          contact_phone: '+49 30 1234567'
        }
      ]
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
