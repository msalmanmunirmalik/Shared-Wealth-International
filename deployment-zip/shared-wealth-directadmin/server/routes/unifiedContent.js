import { Router } from 'express';
import { UnifiedContentController } from '../controllers/unifiedContentController.js';
import { authenticateToken } from '../middleware/auth.js';
import { generalLimiter } from '../middleware/rateLimit.js';
const router = Router();
router.get('/', generalLimiter, UnifiedContentController.getAllContent);
router.get('/:id', generalLimiter, UnifiedContentController.getContentById);
router.post('/', authenticateToken, generalLimiter, UnifiedContentController.createContent);
router.put('/:id', authenticateToken, generalLimiter, UnifiedContentController.updateContent);
router.delete('/:id', authenticateToken, generalLimiter, UnifiedContentController.deleteContent);
router.get('/company/:companyId', generalLimiter, UnifiedContentController.getContentByCompany);
router.get('/user/:userId', generalLimiter, UnifiedContentController.getContentByUser);
router.patch('/:id/publish', authenticateToken, generalLimiter, UnifiedContentController.togglePublishStatus);
export default router;
//# sourceMappingURL=unifiedContent.js.map