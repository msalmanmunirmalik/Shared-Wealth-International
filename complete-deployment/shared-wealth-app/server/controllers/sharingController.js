import { DatabaseService } from '../../src/integrations/postgresql/database.js';
export class SharingController {
    static async shareContent(req, res) {
        try {
            const userId = req.user?.id;
            const { contentId, contentType, shareType, platform, message } = req.body;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User authentication required'
                });
            }
            if (!contentId || !contentType || !shareType) {
                return res.status(400).json({
                    success: false,
                    message: 'contentId, contentType, and shareType are required'
                });
            }
            const validContentTypes = ['forum_topic', 'forum_reply', 'company_post', 'event', 'project'];
            if (!validContentTypes.includes(contentType)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid content type'
                });
            }
            const validShareTypes = ['internal', 'linkedin', 'twitter', 'facebook', 'email'];
            if (!validShareTypes.includes(shareType)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid share type'
                });
            }
            const share = await DatabaseService.insert('content_shares', {
                user_id: userId,
                content_id: contentId,
                content_type: contentType,
                share_type: shareType,
                platform: platform || null,
                message: message || null
            });
            const user = await DatabaseService.findById('users', userId);
            const shareData = {
                id: share.id,
                userId: share.user_id,
                contentId: share.content_id,
                contentType: share.content_type,
                shareType: share.share_type,
                platform: share.platform,
                message: share.message,
                createdAt: share.created_at,
                user: user ? {
                    id: user.id,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    avatarUrl: user.avatar_url
                } : undefined
            };
            res.json({
                success: true,
                data: shareData
            });
        }
        catch (error) {
            console.error('Share content error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getShareStats(req, res) {
        try {
            const { contentId, contentType } = req.params;
            const userId = req.query.userId;
            const shares = await DatabaseService.findAll('content_shares', {
                where: {
                    content_id: contentId,
                    content_type: contentType
                }
            });
            const platformBreakdown = {
                internal: 0,
                linkedin: 0,
                twitter: 0,
                facebook: 0,
                email: 0
            };
            let userShared = false;
            shares.forEach(share => {
                if (platformBreakdown.hasOwnProperty(share.share_type)) {
                    platformBreakdown[share.share_type]++;
                }
                if (userId && share.user_id === userId) {
                    userShared = true;
                }
            });
            const stats = {
                totalShares: shares.length,
                platformBreakdown,
                userShared
            };
            res.json({
                success: true,
                data: stats
            });
        }
        catch (error) {
            console.error('Get share stats error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getContentShares(req, res) {
        try {
            const { contentId, contentType } = req.params;
            const { limit = 50, offset = 0 } = req.query;
            const shares = await DatabaseService.query(`
        SELECT 
          cs.*,
          u.first_name,
          u.last_name,
          u.avatar_url
        FROM content_shares cs
        INNER JOIN users u ON cs.user_id = u.id
        WHERE cs.content_id = $1 AND cs.content_type = $2
        ORDER BY cs.created_at DESC
        LIMIT $3 OFFSET $4
      `, [contentId, contentType, parseInt(limit), parseInt(offset)]);
            const shareData = shares.map(share => ({
                id: share.id,
                userId: share.user_id,
                contentId: share.content_id,
                contentType: share.content_type,
                shareType: share.share_type,
                platform: share.platform,
                message: share.message,
                createdAt: share.created_at,
                user: {
                    id: share.user_id,
                    firstName: share.first_name,
                    lastName: share.last_name,
                    avatarUrl: share.avatar_url
                }
            }));
            res.json({
                success: true,
                data: shareData
            });
        }
        catch (error) {
            console.error('Get content shares error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getUserShares(req, res) {
        try {
            const userId = req.user?.id;
            const { limit = 50, offset = 0 } = req.query;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User authentication required'
                });
            }
            const shares = await DatabaseService.findAll('content_shares', {
                where: { user_id: userId },
                limit: parseInt(limit),
                offset: parseInt(offset)
            });
            const shareData = shares.map(share => ({
                id: share.id,
                userId: share.user_id,
                contentId: share.content_id,
                contentType: share.content_type,
                shareType: share.share_type,
                platform: share.platform,
                message: share.message,
                createdAt: share.created_at
            }));
            res.json({
                success: true,
                data: shareData
            });
        }
        catch (error) {
            console.error('Get user shares error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async generateShareableLink(req, res) {
        try {
            const { contentId, contentType } = req.params;
            const { platform = 'internal' } = req.query;
            let baseUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
            let shareableLink = '';
            switch (contentType) {
                case 'forum_topic':
                    shareableLink = `${baseUrl}/forum/topic/${contentId}`;
                    break;
                case 'forum_reply':
                    shareableLink = `${baseUrl}/forum/reply/${contentId}`;
                    break;
                case 'company_post':
                    shareableLink = `${baseUrl}/companies/post/${contentId}`;
                    break;
                case 'event':
                    shareableLink = `${baseUrl}/events/${contentId}`;
                    break;
                case 'project':
                    shareableLink = `${baseUrl}/projects/${contentId}`;
                    break;
                default:
                    shareableLink = `${baseUrl}/content/${contentType}/${contentId}`;
            }
            if (platform === 'linkedin') {
                shareableLink += '?utm_source=linkedin&utm_medium=share';
            }
            else if (platform === 'twitter') {
                shareableLink += '?utm_source=twitter&utm_medium=share';
            }
            else if (platform === 'facebook') {
                shareableLink += '?utm_source=facebook&utm_medium=share';
            }
            res.json({
                success: true,
                data: { shareableLink }
            });
        }
        catch (error) {
            console.error('Generate shareable link error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getTrendingSharedContent(req, res) {
        try {
            const { limit = 20, timeframe = '7d' } = req.query;
            let timeFilter = '';
            switch (timeframe) {
                case '24h':
                    timeFilter = "AND cs.created_at >= NOW() - INTERVAL '1 day'";
                    break;
                case '7d':
                    timeFilter = "AND cs.created_at >= NOW() - INTERVAL '7 days'";
                    break;
                case '30d':
                    timeFilter = "AND cs.created_at >= NOW() - INTERVAL '30 days'";
                    break;
                default:
                    timeFilter = "AND cs.created_at >= NOW() - INTERVAL '7 days'";
            }
            const trendingContent = await DatabaseService.query(`
        SELECT 
          cs.content_id,
          cs.content_type,
          COUNT(*) as share_count,
          MAX(cs.created_at) as last_shared
        FROM content_shares cs
        WHERE 1=1 ${timeFilter}
        GROUP BY cs.content_id, cs.content_type
        ORDER BY share_count DESC, last_shared DESC
        LIMIT $1
      `, [parseInt(limit)]);
            res.json({
                success: true,
                data: trendingContent
            });
        }
        catch (error) {
            console.error('Get trending shared content error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}
//# sourceMappingURL=sharingController.js.map