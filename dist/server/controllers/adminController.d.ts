import { Request, Response } from 'express';
export declare class AdminController {
    static getAdminStats(req: Request, res: Response): Promise<void>;
    static getUsers(req: Request, res: Response): Promise<void>;
    static getUserById(req: Request, res: Response): Promise<void>;
    static updateUserRole(req: Request, res: Response): Promise<void>;
    static updateUser(req: Request, res: Response): Promise<void>;
    static deleteUser(req: Request, res: Response): Promise<void>;
    static approveCompany(req: Request, res: Response): Promise<void>;
    static rejectCompany(req: Request, res: Response): Promise<void>;
    static getSystemHealth(req: Request, res: Response): Promise<void>;
    static getAnalytics(req: Request, res: Response): Promise<void>;
    static getFundingAnalytics(req: Request, res: Response): Promise<void>;
    static getAuditLog(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=adminController.d.ts.map