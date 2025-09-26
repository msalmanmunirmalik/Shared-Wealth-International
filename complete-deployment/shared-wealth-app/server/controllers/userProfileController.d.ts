import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { ApiResponse } from '../types/index.js';
export declare class UserProfileController {
    static getUserProfile(req: AuthenticatedRequest, res: Response<ApiResponse<any>>): Promise<Response<ApiResponse<any>, Record<string, any>> | undefined>;
    static updateUserProfile(req: AuthenticatedRequest, res: Response<ApiResponse<any>>): Promise<Response<ApiResponse<any>, Record<string, any>> | undefined>;
    static getUserCompanies(req: AuthenticatedRequest, res: Response<ApiResponse<any>>): Promise<Response<ApiResponse<any>, Record<string, any>> | undefined>;
    static getTeamMembers(req: Request, res: Response<ApiResponse<any>>): Promise<void>;
}
//# sourceMappingURL=userProfileController.d.ts.map