import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { ApiResponse } from '../types/index.js';
export interface DashboardStats {
    totalCompanies: number;
    networkPartners: number;
    growthRate: number;
    activeProjects: number;
    pendingApplications: number;
    approvedCompanies: number;
    totalUsers: number;
    totalEvents: number;
    totalForumPosts: number;
    totalMessages: number;
    recentActivities: number;
    collaborationMeetings: number;
}
export declare class DashboardController {
    static getDashboardStats(req: AuthenticatedRequest, res: Response<ApiResponse<DashboardStats>>): Promise<Response<ApiResponse<DashboardStats>, Record<string, any>> | undefined>;
    static getRecentActivities(req: AuthenticatedRequest, res: Response<ApiResponse<any[]>>): Promise<Response<ApiResponse<any[]>, Record<string, any>> | undefined>;
    static getUserProjects(req: AuthenticatedRequest, res: Response<ApiResponse<any[]>>): Promise<Response<ApiResponse<any[]>, Record<string, any>> | undefined>;
    static getUserMeetings(req: AuthenticatedRequest, res: Response<ApiResponse<any[]>>): Promise<Response<ApiResponse<any[]>, Record<string, any>> | undefined>;
    static getPlatformStats(req: AuthenticatedRequest, res: Response<ApiResponse<any>>): Promise<Response<ApiResponse<any>, Record<string, any>> | undefined>;
}
//# sourceMappingURL=dashboardController.d.ts.map