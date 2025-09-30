import { Request, Response } from 'express';
export declare class UnifiedSocialController {
    static addReaction(req: Request, res: Response): Promise<void>;
    static removeReaction(req: Request, res: Response): Promise<void>;
    static getReactions(req: Request, res: Response): Promise<void>;
    static followUser(req: Request, res: Response): Promise<void>;
    static unfollowUser(req: Request, res: Response): Promise<void>;
    static getConnections(req: Request, res: Response): Promise<void>;
    static getConnectionStats(req: Request, res: Response): Promise<void>;
    static shareContent(req: Request, res: Response): Promise<void>;
    static getSharedContent(req: Request, res: Response): Promise<void>;
    static bookmarkContent(req: Request, res: Response): Promise<void>;
    static removeBookmark(req: Request, res: Response): Promise<void>;
    static getBookmarks(req: Request, res: Response): Promise<void>;
    static getSocialAnalytics(req: Request, res: Response): Promise<void>;
    static getSocialFeed(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=unifiedSocialController.d.ts.map