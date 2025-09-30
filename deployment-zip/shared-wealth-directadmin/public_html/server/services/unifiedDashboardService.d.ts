import { ApiResponse } from '../types/api.js';
export interface DashboardFilters {
    sections?: string;
    period?: string;
    type?: string;
    entityId?: string;
    entityType?: string;
    limit?: number;
    offset?: number;
}
export interface DashboardData {
    user: any;
    companies: any[];
    analytics: any;
    notifications: any[];
    activityFeed: any[];
    widgets: any[];
    recentContent: any[];
    socialStats: any;
    adminStats?: any;
}
export interface WidgetConfig {
    id: string;
    type: string;
    title: string;
    position: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    config: any;
    enabled: boolean;
}
export declare class UnifiedDashboardService {
    static getDashboardData(userId: string, filters: DashboardFilters): Promise<ApiResponse<DashboardData>>;
    static getUserDashboardData(userId: string, period: string): Promise<ApiResponse<any>>;
    static getCompanyDashboardData(companyId: string, period: string): Promise<ApiResponse<any>>;
    static getAdminDashboardData(period: string): Promise<ApiResponse<any>>;
    static getAnalytics(userId: string, filters: DashboardFilters): Promise<ApiResponse<any>>;
    static getDashboardWidgets(userId: string, dashboardType: string): Promise<ApiResponse<WidgetConfig[]>>;
    static updateDashboardWidgets(userId: string, widgets: WidgetConfig[]): Promise<ApiResponse<WidgetConfig[]>>;
    static getNotifications(userId: string, filters: {
        limit: number;
        offset: number;
        type: string;
    }): Promise<ApiResponse<any[]>>;
    static markNotificationRead(userId: string, notificationId: string): Promise<ApiResponse<boolean>>;
    static getActivityFeed(userId: string, filters: {
        limit: number;
        offset: number;
        type: string;
    }): Promise<ApiResponse<any[]>>;
    static checkCompanyAccess(userId: string, companyId: string): Promise<boolean>;
    static checkAdminAccess(userId: string): Promise<boolean>;
    private static getUserData;
    private static getUserCompanies;
    private static getUserAnalytics;
    private static getSocialStats;
    private static getRecentContent;
    private static getCompanyData;
    private static getCompanyAnalytics;
    private static getCompanyContent;
    private static getCompanyTeam;
    private static getAdminStats;
    private static getPlatformStats;
    private static getUserStats;
    private static getCompanyStats;
    private static getContentStats;
    private static getSystemStats;
    private static getPlatformAnalytics;
    private static getDefaultWidgets;
}
//# sourceMappingURL=unifiedDashboardService.d.ts.map