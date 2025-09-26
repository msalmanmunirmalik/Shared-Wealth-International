import { Router } from 'express';
import { UnifiedFileController, upload } from '../controllers/unifiedFileController.js';
import { authenticateToken } from '../middleware/auth.js';
import { generalLimiter } from '../middleware/rateLimit.js';
const router = Router();
router.post('/upload', authenticateToken, generalLimiter, upload.single('file'), UnifiedFileController.uploadFile);
router.post('/upload/multiple', authenticateToken, generalLimiter, upload.array('files', 10), UnifiedFileController.uploadMultipleFiles);
router.get('/:fileId', authenticateToken, generalLimiter, UnifiedFileController.getFile);
router.get('/:fileId/download', authenticateToken, generalLimiter, UnifiedFileController.downloadFile);
router.get('/context/:context/:contextId', authenticateToken, generalLimiter, UnifiedFileController.getFilesByContext);
router.get('/user/:userId', authenticateToken, generalLimiter, UnifiedFileController.getUserFiles);
router.put('/:fileId', authenticateToken, generalLimiter, UnifiedFileController.updateFile);
router.delete('/:fileId', authenticateToken, generalLimiter, UnifiedFileController.deleteFile);
router.post('/:fileId/share', authenticateToken, generalLimiter, UnifiedFileController.shareFile);
router.get('/:fileId/shares', authenticateToken, generalLimiter, UnifiedFileController.getFileShares);
router.get('/:fileId/analytics', authenticateToken, generalLimiter, UnifiedFileController.getFileAnalytics);
router.get('/storage/stats', authenticateToken, generalLimiter, UnifiedFileController.getStorageStats);
export default router;
//# sourceMappingURL=unifiedFile.js.map