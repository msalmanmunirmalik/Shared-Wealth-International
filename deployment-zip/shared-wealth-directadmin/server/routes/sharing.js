import { Router } from 'express';
import { SharingController } from '../controllers/sharingController.js';
import { authenticateToken } from '../middleware/auth.js';
import { generalLimiter } from '../middleware/rateLimit.js';
const router = Router();
router.post('/share', authenticateToken, generalLimiter, SharingController.shareContent);
router.get('/:contentId/:contentType/stats', generalLimiter, SharingController.getShareStats);
router.get('/:contentId/:contentType/shares', generalLimiter, SharingController.getContentShares);
router.get('/user', authenticateToken, generalLimiter, SharingController.getUserShares);
router.get('/:contentId/:contentType/link', generalLimiter, SharingController.generateShareableLink);
router.get('/trending', generalLimiter, SharingController.getTrendingSharedContent);
export default router;
//# sourceMappingURL=sharing.js.map