import { ApiResponse, PaginationParams, PaginatedResponse } from '../types/index.js';
export interface FundingApplication {
    id: string;
    opportunity_id: string;
    applicant_id: string;
    company_id: string;
    application_data: {
        project_title: string;
        project_description: string;
        requested_amount: number;
        project_duration: string;
        team_size: number;
        previous_experience: string;
        business_plan: string;
        financial_projections: string;
        sustainability_plan: string;
        expected_outcomes: string;
    };
    status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'funded' | 'completed';
    submitted_at: string;
    reviewed_at?: string;
    approved_at?: string;
    funded_at?: string;
    completed_at?: string;
    review_notes?: string;
    rejection_reason?: string;
    funding_amount?: number;
    created_at: string;
    updated_at: string;
}
export interface FundingOpportunity {
    id: string;
    title: string;
    category: string;
    description: string;
    amount: string;
    deadline: string;
    eligibility: string;
    url: string;
    status: 'active' | 'inactive' | 'expired';
    max_applications?: number;
    current_applications: number;
    funded_projects: number;
    success_rate: number;
    created_at: string;
    updated_at: string;
}
export interface FundingAnalytics {
    totalApplications: number;
    approvedApplications: number;
    rejectedApplications: number;
    pendingApplications: number;
    totalFundingDisbursed: number;
    averageApplicationValue: number;
    successRate: number;
    applicationsByCategory: Array<{
        category: string;
        count: number;
        amount: number;
    }>;
    applicationsByStatus: Array<{
        status: string;
        count: number;
    }>;
    monthlyTrends: Array<{
        month: string;
        applications: number;
        approvals: number;
        funding: number;
    }>;
    topApplicants: Array<{
        company_id: string;
        company_name: string;
        applications: number;
        approvals: number;
        total_funding: number;
    }>;
}
export declare class FundingService {
    static createFundingApplication(data: Omit<FundingApplication, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<FundingApplication>>;
    static updateFundingApplication(id: string, data: Partial<FundingApplication>): Promise<ApiResponse<FundingApplication>>;
    static getFundingApplications(pagination?: PaginationParams, filters?: {
        status?: string;
        opportunity_id?: string;
        applicant_id?: string;
    }): Promise<ApiResponse<PaginatedResponse<FundingApplication> | FundingApplication[]>>;
    static getFundingApplicationById(id: string): Promise<ApiResponse<FundingApplication>>;
    static approveFundingApplication(id: string, fundingAmount: number, reviewNotes?: string): Promise<ApiResponse<FundingApplication>>;
    static rejectFundingApplication(id: string, rejectionReason: string): Promise<ApiResponse<FundingApplication>>;
    static deleteFundingApplication(id: string): Promise<ApiResponse<{
        message: string;
    }>>;
    static getFundingOpportunitiesWithStats(pagination?: PaginationParams): Promise<ApiResponse<PaginatedResponse<FundingOpportunity> | FundingOpportunity[]>>;
    static getFundingAnalytics(): Promise<ApiResponse<FundingAnalytics>>;
}
//# sourceMappingURL=fundingService.d.ts.map