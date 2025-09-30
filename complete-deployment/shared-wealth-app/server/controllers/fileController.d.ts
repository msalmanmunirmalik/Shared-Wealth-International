import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { ApiResponse } from '../types/index.js';
export declare class FileController {
    static uploadFile(req: AuthenticatedRequest, res: Response<ApiResponse<any>>): Promise<Response<ApiResponse<any>, Record<string, any>> | undefined>;
    static uploadMultipleFiles(req: AuthenticatedRequest, res: Response<ApiResponse<any>>): Promise<Response<ApiResponse<any>, Record<string, any>> | undefined>;
    static getFile(req: Request, res: Response<ApiResponse<any>>): Promise<Response<ApiResponse<any>, Record<string, any>> | undefined>;
    static getUserFiles(req: AuthenticatedRequest, res: Response<ApiResponse<any>>): Promise<void>;
    static deleteFile(req: AuthenticatedRequest, res: Response<ApiResponse<any>>): Promise<Response<ApiResponse<any>, Record<string, any>> | undefined>;
    static serveFile(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=fileController.d.ts.map