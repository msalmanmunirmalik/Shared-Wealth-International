import { Router } from 'express';
import { ReactionsController } from '../controllers/reactionsController.js';
import { authenticateToken } from '../middleware/auth.js';
import { generalLimiter } from '../middleware/rateLimit.js';
const router = Router();
router.post('/', authenticateToken, generalLimiter, ReactionsController.addReaction);
router.delete('/:postId/:postType', authenticateToken, generalLimiter, ReactionsController.removeReaction);
router.get('/:postId/:postType/stats', generalLimiter, ReactionsController.getReactionStats);
router.get('/:postId/:postType/list', generalLimiter, ReactionsController.getPostReactions);
router.get('/user', authenticateToken, generalLimiter, ReactionsController.getUserReactions);
export default router;
//# sourceMappingURL=reactions.js.map