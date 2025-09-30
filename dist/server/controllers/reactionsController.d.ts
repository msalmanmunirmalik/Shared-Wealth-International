import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { ApiResponse } from '../types/index.js';
export interface ReactionData {
    id: string;
    postId: string;
    postType: string;
    userId: string;
    reactionType: string;
    createdAt: string;
    user?: {
        id: string;
        firstName: string;
        lastName: string;
        avatarUrl?: string;
    };
}
export interface ReactionStats {
    totalReactions: number;
    reactionBreakdown: {
        like: number;
        dislike: number;
        love: number;
        laugh: number;
        wow: number;
        sad: number;
        angry: number;
    };
    userReaction?: string;
}
export declare class ReactionsController {
    static addReaction(req: AuthenticatedRequest, res: Response<ApiResponse<ReactionData>>): Promise<Response<ApiResponse<ReactionData>, Record<string, any>> | undefined>;
    static removeReaction(req: AuthenticatedRequest, res: Response<ApiResponse<null>>): Promise<Response<ApiResponse<null>, Record<string, any>> | undefined>;
    static getReactionStats(req: Request, res: Response<ApiResponse<ReactionStats>>): Promise<Response<ApiResponse<ReactionStats>, Record<string, any>> | undefined>;
    static getPostReactions(req: Request, res: Response<ApiResponse<ReactionData[]>>): Promise<void>;
    static getUserReactions(req: AuthenticatedRequest, res: Response<ApiResponse<ReactionData[]>>): Promise<Response<ApiResponse<ReactionData[]>, Record<string, any>> | undefined>;
}
//# sourceMappingURL=reactionsController.d.ts.map