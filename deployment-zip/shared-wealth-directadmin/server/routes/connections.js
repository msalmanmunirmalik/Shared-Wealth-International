import { Router } from 'express';
import { ConnectionsController } from '../controllers/connectionsController.js';
import { authenticateToken } from '../middleware/auth.js';
import { generalLimiter } from '../middleware/rateLimit.js';
const router = Router();
router.post('/follow', authenticateToken, generalLimiter, ConnectionsController.followUser);
router.delete('/unfollow/:targetUserId', authenticateToken, generalLimiter, ConnectionsController.unfollowUser);
router.get('/:userId/followers', generalLimiter, ConnectionsController.getFollowers);
router.get('/:userId/following', generalLimiter, ConnectionsController.getFollowing);
router.get('/:userId/stats', generalLimiter, ConnectionsController.getConnectionStats);
router.get('/:userId1/:userId2/mutual', generalLimiter, ConnectionsController.getMutualConnections);
router.get('/suggested', authenticateToken, generalLimiter, ConnectionsController.getSuggestedUsers);
export default router;
//# sourceMappingURL=connections.js.map