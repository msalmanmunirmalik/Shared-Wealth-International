import { DatabaseService } from '../../src/integrations/postgresql/database.js';
export class ConnectionsController {
    static async followUser(req, res) {
        try {
            const userId = req.user?.id;
            const { targetUserId, connectionType = 'follow' } = req.body;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User authentication required'
                });
            }
            if (!targetUserId) {
                return res.status(400).json({
                    success: false,
                    message: 'targetUserId is required'
                });
            }
            if (userId === targetUserId) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot follow yourself'
                });
            }
            const existingConnection = await DatabaseService.findAll('user_connections', {
                where: {
                    follower_id: userId,
                    following_id: targetUserId
                },
                limit: 1
            });
            if (existingConnection.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Already following this user'
                });
            }
            const connection = await DatabaseService.insert('user_connections', {
                follower_id: userId,
                following_id: targetUserId,
                connection_type: connectionType,
                status: 'active'
            });
            const follower = await DatabaseService.findById('users', userId);
            const following = await DatabaseService.findById('users', targetUserId);
            const connectionData = {
                id: connection.id,
                followerId: connection.follower_id,
                followingId: connection.following_id,
                connectionType: connection.connection_type,
                status: connection.status,
                createdAt: connection.created_at,
                follower: follower ? {
                    id: follower.id,
                    firstName: follower.first_name,
                    lastName: follower.last_name,
                    avatarUrl: follower.avatar_url
                } : undefined,
                following: following ? {
                    id: following.id,
                    firstName: following.first_name,
                    lastName: following.last_name,
                    avatarUrl: following.avatar_url
                } : undefined
            };
            res.json({
                success: true,
                data: connectionData
            });
        }
        catch (error) {
            console.error('Follow user error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async unfollowUser(req, res) {
        try {
            const userId = req.user?.id;
            const { targetUserId } = req.params;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User authentication required'
                });
            }
            const connections = await DatabaseService.findAll('user_connections', {
                where: {
                    follower_id: userId,
                    following_id: targetUserId
                }
            });
            if (connections.length > 0) {
                await DatabaseService.delete('user_connections', connections[0].id);
            }
            res.json({
                success: true,
                data: null,
                message: 'Unfollowed successfully'
            });
        }
        catch (error) {
            console.error('Unfollow user error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getFollowers(req, res) {
        try {
            const { userId } = req.params;
            const { limit = 50, offset = 0 } = req.query;
            const connections = await DatabaseService.query(`
        SELECT 
          uc.*,
          u.first_name,
          u.last_name,
          u.avatar_url
        FROM user_connections uc
        INNER JOIN users u ON uc.follower_id = u.id
        WHERE uc.following_id = $1 AND uc.status = 'active'
        ORDER BY uc.created_at DESC
        LIMIT $2 OFFSET $3
      `, [userId, parseInt(limit), parseInt(offset)]);
            const connectionData = connections.map(connection => ({
                id: connection.id,
                followerId: connection.follower_id,
                followingId: connection.following_id,
                connectionType: connection.connection_type,
                status: connection.status,
                createdAt: connection.created_at,
                follower: {
                    id: connection.follower_id,
                    firstName: connection.first_name,
                    lastName: connection.last_name,
                    avatarUrl: connection.avatar_url
                }
            }));
            res.json({
                success: true,
                data: connectionData
            });
        }
        catch (error) {
            console.error('Get followers error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getFollowing(req, res) {
        try {
            const { userId } = req.params;
            const { limit = 50, offset = 0 } = req.query;
            const connections = await DatabaseService.query(`
        SELECT 
          uc.*,
          u.first_name,
          u.last_name,
          u.avatar_url
        FROM user_connections uc
        INNER JOIN users u ON uc.following_id = u.id
        WHERE uc.follower_id = $1 AND uc.status = 'active'
        ORDER BY uc.created_at DESC
        LIMIT $2 OFFSET $3
      `, [userId, parseInt(limit), parseInt(offset)]);
            const connectionData = connections.map(connection => ({
                id: connection.id,
                followerId: connection.follower_id,
                followingId: connection.following_id,
                connectionType: connection.connection_type,
                status: connection.status,
                createdAt: connection.created_at,
                following: {
                    id: connection.following_id,
                    firstName: connection.first_name,
                    lastName: connection.last_name,
                    avatarUrl: connection.avatar_url
                }
            }));
            res.json({
                success: true,
                data: connectionData
            });
        }
        catch (error) {
            console.error('Get following error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getConnectionStats(req, res) {
        try {
            const { userId } = req.params;
            const currentUserId = req.query.currentUserId;
            const followersResult = await DatabaseService.query(`
        SELECT COUNT(*) as count
        FROM user_connections
        WHERE following_id = $1 AND status = 'active'
      `, [userId]);
            const followingResult = await DatabaseService.query(`
        SELECT COUNT(*) as count
        FROM user_connections
        WHERE follower_id = $1 AND status = 'active'
      `, [userId]);
            let isFollowing = false;
            let isFollowedBy = false;
            if (currentUserId && currentUserId !== userId) {
                const followingCheck = await DatabaseService.findAll('user_connections', {
                    where: {
                        follower_id: currentUserId,
                        following_id: userId,
                        status: 'active'
                    },
                    limit: 1
                });
                isFollowing = followingCheck.length > 0;
                const followedByCheck = await DatabaseService.findAll('user_connections', {
                    where: {
                        follower_id: userId,
                        following_id: currentUserId,
                        status: 'active'
                    },
                    limit: 1
                });
                isFollowedBy = followedByCheck.length > 0;
            }
            const stats = {
                followersCount: parseInt(followersResult[0]?.count || '0'),
                followingCount: parseInt(followingResult[0]?.count || '0'),
                isFollowing,
                isFollowedBy
            };
            res.json({
                success: true,
                data: stats
            });
        }
        catch (error) {
            console.error('Get connection stats error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getMutualConnections(req, res) {
        try {
            const { userId1, userId2 } = req.params;
            const { limit = 50, offset = 0 } = req.query;
            const mutualConnections = await DatabaseService.query(`
        SELECT DISTINCT
          u.id,
          u.first_name,
          u.last_name,
          u.avatar_url
        FROM users u
        INNER JOIN user_connections uc1 ON u.id = uc1.following_id
        INNER JOIN user_connections uc2 ON u.id = uc2.following_id
        WHERE uc1.follower_id = $1 
          AND uc2.follower_id = $2
          AND uc1.status = 'active'
          AND uc2.status = 'active'
          AND u.id != $1
          AND u.id != $2
        ORDER BY u.first_name, u.last_name
        LIMIT $3 OFFSET $4
      `, [userId1, userId2, parseInt(limit), parseInt(offset)]);
            const connectionData = mutualConnections.map(user => ({
                id: user.id,
                followerId: userId1,
                followingId: user.id,
                connectionType: 'mutual',
                status: 'active',
                createdAt: new Date().toISOString(),
                following: {
                    id: user.id,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    avatarUrl: user.avatar_url
                }
            }));
            res.json({
                success: true,
                data: connectionData
            });
        }
        catch (error) {
            console.error('Get mutual connections error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getSuggestedUsers(req, res) {
        try {
            const userId = req.user?.id;
            const { limit = 20 } = req.query;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User authentication required'
                });
            }
            const suggestedUsers = await DatabaseService.query(`
        SELECT DISTINCT
          u.id,
          u.first_name,
          u.last_name,
          u.avatar_url,
          COUNT(uc.follower_id) as mutual_count
        FROM users u
        LEFT JOIN user_connections uc ON u.id = uc.following_id
        LEFT JOIN user_connections uc2 ON uc.follower_id = uc2.following_id
        WHERE u.id != $1
          AND u.id NOT IN (
            SELECT following_id 
            FROM user_connections 
            WHERE follower_id = $1 AND status = 'active'
          )
          AND uc2.follower_id = $1
        GROUP BY u.id, u.first_name, u.last_name, u.avatar_url
        ORDER BY mutual_count DESC, u.first_name
        LIMIT $2
      `, [userId, parseInt(limit)]);
            const connectionData = suggestedUsers.map(user => ({
                id: user.id,
                followerId: userId,
                followingId: user.id,
                connectionType: 'suggested',
                status: 'pending',
                createdAt: new Date().toISOString(),
                following: {
                    id: user.id,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    avatarUrl: user.avatar_url
                }
            }));
            res.json({
                success: true,
                data: connectionData
            });
        }
        catch (error) {
            console.error('Get suggested users error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}
//# sourceMappingURL=connectionsController.js.map