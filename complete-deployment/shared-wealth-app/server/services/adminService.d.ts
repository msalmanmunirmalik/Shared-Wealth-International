import { User, Company, AdminStats, ApiResponse, PaginationParams, PaginatedResponse } from '../types/index.js';
export declare class AdminService {
    static getAdminStats(): Promise<ApiResponse<AdminStats>>;
    static getUsers(pagination?: PaginationParams): Promise<ApiResponse<PaginatedResponse<User> | User[]>>;
    static getUserById(id: string): Promise<ApiResponse<User>>;
    static updateUserRole(userId: string, newRole: 'user' | 'admin' | 'superadmin'): Promise<ApiResponse<User>>;
    static updateUser(userId: string, updateData: Partial<User>): Promise<ApiResponse<User>>;
    static deleteUser(userId: string): Promise<ApiResponse<{
        message: string;
    }>>;
    static approveCompany(companyId: string): Promise<ApiResponse<Company>>;
    static rejectCompany(companyId: string, reason?: string): Promise<ApiResponse<Company>>;
    static getSystemHealth(): Promise<ApiResponse<{
        database: boolean;
        timestamp: string;
        uptime: number;
        memory: NodeJS.MemoryUsage;
    }>>;
    static getAnalytics(): Promise<ApiResponse<{
        platformGrowth: {
            totalUsers: number;
            totalCompanies: number;
            totalFundingOpportunities: number;
            totalApplications: number;
        };
        userEngagement: {
            activeUsers: number;
            newUsersThisMonth: number;
            userGrowthRate: number;
        };
        companyMetrics: {
            pendingCompanies: number;
            approvedCompanies: number;
            rejectedCompanies: number;
            averageApprovalTime: number;
        };
        fundingMetrics: {
            totalOpportunities: number;
            totalApplications: number;
            applicationRate: number;
            successRate: number;
        };
        sectorDistribution: Array<{
            sector: string;
            count: number;
        }>;
        geographicDistribution: Array<{
            location: string;
            count: number;
        }>;
        monthlyGrowth: Array<{
            month: string;
            users: number;
            companies: number;
        }>;
    }>>;
    static getFundingAnalytics(): Promise<ApiResponse<{
        opportunities: Array<{
            id: string;
            title: string;
            category: string;
            amount: string;
            deadline: string;
            applicationCount: number;
            status: string;
        }>;
        categories: Array<{
            category: string;
            count: number;
        }>;
        trends: Array<{
            month: string;
            applications: number;
            opportunities: number;
        }>;
    }>>;
    static getAuditLog(pagination?: PaginationParams, filters?: {
        action?: string;
        userId?: string;
        dateFrom?: string;
        dateTo?: string;
    }): Promise<ApiResponse<{
        message: string;
    }>>;
}
//# sourceMappingURL=adminService.d.ts.map