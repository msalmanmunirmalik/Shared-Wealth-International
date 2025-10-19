import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { ApiResponse } from '../types/index.js';
export interface ConnectionData {
    id: string;
    followerId: string;
    followingId: string;
    connectionType: string;
    status: string;
    createdAt: string;
    follower?: {
        id: string;
        firstName: string;
        lastName: string;
        avatarUrl?: string;
    };
    following?: {
        id: string;
        firstName: string;
        lastName: string;
        avatarUrl?: string;
    };
}
export interface ConnectionStats {
    followersCount: number;
    followingCount: number;
    isFollowing: boolean;
    isFollowedBy: boolean;
}
export declare class ConnectionsController {
    static followUser(req: AuthenticatedRequest, res: Response<ApiResponse<ConnectionData>>): Promise<Response<ApiResponse<ConnectionData>, Record<string, any>> | undefined>;
    static unfollowUser(req: AuthenticatedRequest, res: Response<ApiResponse<null>>): Promise<Response<ApiResponse<null>, Record<string, any>> | undefined>;
    static getFollowers(req: Request, res: Response<ApiResponse<ConnectionData[]>>): Promise<void>;
    static getFollowing(req: Request, res: Response<ApiResponse<ConnectionData[]>>): Promise<void>;
    static getConnectionStats(req: Request, res: Response<ApiResponse<ConnectionStats>>): Promise<void>;
    static getMutualConnections(req: Request, res: Response<ApiResponse<ConnectionData[]>>): Promise<void>;
    static getSuggestedUsers(req: AuthenticatedRequest, res: Response<ApiResponse<ConnectionData[]>>): Promise<Response<ApiResponse<ConnectionData[]>, Record<string, any>> | undefined>;
}
//# sourceMappingURL=connectionsController.d.ts.map