import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { ApiResponse } from '../types/index.js';
export declare class NetworkController {
    static getUserNetwork(req: AuthenticatedRequest, res: Response<ApiResponse<any[]>>): Promise<Response<ApiResponse<any[]>, Record<string, any>> | undefined>;
    static addToNetwork(req: AuthenticatedRequest, res: Response<ApiResponse<any>>): Promise<Response<ApiResponse<any>, Record<string, any>> | undefined>;
    static removeFromNetwork(req: AuthenticatedRequest, res: Response<ApiResponse<any>>): Promise<Response<ApiResponse<any>, Record<string, any>> | undefined>;
    static getAvailableCompanies(req: AuthenticatedRequest, res: Response<ApiResponse<any[]>>): Promise<Response<ApiResponse<any[]>, Record<string, any>> | undefined>;
}
//# sourceMappingURL=networkController.d.ts.map