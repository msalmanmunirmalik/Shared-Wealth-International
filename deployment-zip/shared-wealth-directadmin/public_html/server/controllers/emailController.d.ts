import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { ApiResponse } from '../types/index.js';
export declare class EmailController {
    static sendEmail(req: AuthenticatedRequest, res: Response<ApiResponse<any>>): Promise<Response<ApiResponse<any>, Record<string, any>> | undefined>;
    static sendWelcomeEmail(req: AuthenticatedRequest, res: Response<ApiResponse<any>>): Promise<Response<ApiResponse<any>, Record<string, any>> | undefined>;
    static sendPasswordResetEmail(req: AuthenticatedRequest, res: Response<ApiResponse<any>>): Promise<Response<ApiResponse<any>, Record<string, any>> | undefined>;
    static sendCompanyApprovalEmail(req: AuthenticatedRequest, res: Response<ApiResponse<any>>): Promise<Response<ApiResponse<any>, Record<string, any>> | undefined>;
    static sendCompanyRejectionEmail(req: AuthenticatedRequest, res: Response<ApiResponse<any>>): Promise<Response<ApiResponse<any>, Record<string, any>> | undefined>;
    static sendNotificationEmail(req: AuthenticatedRequest, res: Response<ApiResponse<any>>): Promise<Response<ApiResponse<any>, Record<string, any>> | undefined>;
    static testEmailService(req: AuthenticatedRequest, res: Response<ApiResponse<any>>): Promise<void>;
    static getEmailTemplates(req: AuthenticatedRequest, res: Response<ApiResponse<any>>): Promise<void>;
}
export declare const emailValidation: {
    sendEmail: import("express-validator").ValidationChain[];
    sendWelcomeEmail: import("express-validator").ValidationChain[];
    sendPasswordResetEmail: import("express-validator").ValidationChain[];
    sendCompanyApprovalEmail: import("express-validator").ValidationChain[];
    sendCompanyRejectionEmail: import("express-validator").ValidationChain[];
    sendNotificationEmail: import("express-validator").ValidationChain[];
};
//# sourceMappingURL=emailController.d.ts.map