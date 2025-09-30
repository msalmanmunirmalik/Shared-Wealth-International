import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { ApiResponse } from '../types/index.js';
export interface ShareData {
    id: string;
    userId: string;
    contentId: string;
    contentType: string;
    shareType: string;
    platform?: string;
    message?: string;
    createdAt: string;
    user?: {
        id: string;
        firstName: string;
        lastName: string;
        avatarUrl?: string;
    };
    content?: {
        id: string;
        title?: string;
        content?: string;
        type: string;
    };
}
export interface ShareStats {
    totalShares: number;
    platformBreakdown: {
        internal: number;
        linkedin: number;
        twitter: number;
        facebook: number;
        email: number;
    };
    userShared: boolean;
}
export declare class SharingController {
    static shareContent(req: AuthenticatedRequest, res: Response<ApiResponse<ShareData>>): Promise<Response<ApiResponse<ShareData>, Record<string, any>> | undefined>;
    static getShareStats(req: Request, res: Response<ApiResponse<ShareStats>>): Promise<void>;
    static getContentShares(req: Request, res: Response<ApiResponse<ShareData[]>>): Promise<void>;
    static getUserShares(req: AuthenticatedRequest, res: Response<ApiResponse<ShareData[]>>): Promise<Response<ApiResponse<ShareData[]>, Record<string, any>> | undefined>;
    static generateShareableLink(req: Request, res: Response<ApiResponse<{
        shareableLink: string;
    }>>): Promise<void>;
    static getTrendingSharedContent(req: Request, res: Response<ApiResponse<any[]>>): Promise<void>;
}
//# sourceMappingURL=sharingController.d.ts.map