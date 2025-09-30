import { Request, Response } from 'express';
export declare class UnifiedUserController {
    static register(req: Request, res: Response): Promise<void>;
    static login(req: Request, res: Response): Promise<void>;
    static logout(req: Request, res: Response): Promise<void>;
    static getProfile(req: Request, res: Response): Promise<void>;
    static updateProfile(req: Request, res: Response): Promise<void>;
    static changePassword(req: Request, res: Response): Promise<void>;
    static getUser(req: Request, res: Response): Promise<void>;
    static getAllUsers(req: Request, res: Response): Promise<void>;
    static updateUser(req: Request, res: Response): Promise<void>;
    static deleteUser(req: Request, res: Response): Promise<void>;
    static getUserStats(req: Request, res: Response): Promise<void>;
    static getUserActivity(req: Request, res: Response): Promise<void>;
    static verifyEmail(req: Request, res: Response): Promise<void>;
    static requestPasswordReset(req: Request, res: Response): Promise<void>;
    static resetPassword(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=unifiedUserController.d.ts.map