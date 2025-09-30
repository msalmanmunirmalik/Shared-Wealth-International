import { ApiResponse } from '../types/api.js';
export interface SocialFilters {
    type?: string;
    platform?: string;
    content_type?: string;
    limit?: number;
    offset?: number;
}
export interface ConnectionData {
    follower_id: string;
    following_id: string;
    connection_type: string;
}
export interface ReactionData {
    user_id: string;
    content_id: string;
    content_type: string;
    reaction_type: string;
}
export interface ShareData {
    user_id: string;
    content_id: string;
    content_type: string;
    share_type: string;
    platform: string;
    message?: string;
}
export interface BookmarkData {
    user_id: string;
    content_id: string;
    content_type: string;
}
export declare class UnifiedSocialService {
    static addReaction(userId: string, contentId: string, reactionType: string, contentType: string): Promise<ApiResponse<any>>;
    static removeReaction(userId: string, contentId: string, reactionType: string, contentType: string): Promise<ApiResponse<any>>;
    static getReactions(contentId: string, contentType: string): Promise<ApiResponse<any>>;
    static createConnection(followerId: string, followingId: string, connectionType?: string): Promise<ApiResponse<any>>;
    static removeConnection(followerId: string, followingId: string): Promise<ApiResponse<any>>;
    static getConnections(userId: string, filters: SocialFilters): Promise<ApiResponse<any[]>>;
    static getConnectionStats(userId: string): Promise<ApiResponse<any>>;
    static shareContent(userId: string, contentId: string, shareType: string, platform: string, message?: string): Promise<ApiResponse<any>>;
    static getSharedContent(userId: string, filters: SocialFilters): Promise<ApiResponse<any[]>>;
    static bookmarkContent(userId: string, contentId: string, contentType: string): Promise<ApiResponse<any>>;
    static removeBookmark(userId: string, contentId: string): Promise<ApiResponse<any>>;
    static getBookmarks(userId: string, filters: SocialFilters): Promise<ApiResponse<any[]>>;
    static getSocialAnalytics(userId: string, period: string): Promise<ApiResponse<any>>;
    static getSocialFeed(userId: string, filters: SocialFilters): Promise<ApiResponse<any[]>>;
    private static updateContentReactionsCount;
    private static updateContentSharesCount;
}
//# sourceMappingURL=unifiedSocialService.d.ts.map