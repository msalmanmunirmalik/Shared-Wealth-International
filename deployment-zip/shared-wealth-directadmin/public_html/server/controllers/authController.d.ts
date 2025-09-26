import { Request, Response } from 'express';
export declare class AuthController {
    static signIn(req: Request, res: Response): Promise<void>;
    static signUp(req: Request, res: Response): Promise<void>;
    static signOut(req: Request, res: Response): Promise<void>;
    static resetPassword(req: Request, res: Response): Promise<void>;
    static checkAdminStatus(req: Request, res: Response): Promise<void>;
    static checkSuperAdminStatus(req: Request, res: Response): Promise<void>;
    static getCurrentUser(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=authController.d.ts.map