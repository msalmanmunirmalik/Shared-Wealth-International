import { Request, Response } from 'express';
export declare class UnifiedDashboardController {
    static getDashboard(req: Request, res: Response): Promise<void>;
    static getUserDashboard(req: Request, res: Response): Promise<void>;
    static getCompanyDashboard(req: Request, res: Response): Promise<void>;
    static getAdminDashboard(req: Request, res: Response): Promise<void>;
    static getDashboardAnalytics(req: Request, res: Response): Promise<void>;
    static getDashboardWidgets(req: Request, res: Response): Promise<void>;
    static updateDashboardWidgets(req: Request, res: Response): Promise<void>;
    static getDashboardNotifications(req: Request, res: Response): Promise<void>;
    static markNotificationRead(req: Request, res: Response): Promise<void>;
    static getActivityFeed(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=unifiedDashboardController.d.ts.map