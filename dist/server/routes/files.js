import { Router } from 'express';
import { FileController } from '../controllers/fileController.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload, uploadLogo, uploadDocument, uploadImage, handleUploadError } from '../middleware/fileUpload.js';
import { generalLimiter } from '../middleware/rateLimit.js';
const router = Router();
router.post('/upload', generalLimiter, upload.single('file'), handleUploadError, FileController.uploadFile);
router.post('/upload-multiple', authenticateToken, generalLimiter, upload.array('files', 5), handleUploadError, FileController.uploadMultipleFiles);
router.post('/upload-logo', authenticateToken, generalLimiter, uploadLogo.single('logo'), handleUploadError, FileController.uploadFile);
router.post('/upload-document', authenticateToken, generalLimiter, uploadDocument.single('document'), handleUploadError, FileController.uploadFile);
router.post('/upload-image', authenticateToken, generalLimiter, uploadImage.single('image'), handleUploadError, FileController.uploadFile);
router.get('/:id', FileController.getFile);
router.get('/user/files', authenticateToken, generalLimiter, FileController.getUserFiles);
router.delete('/:id', authenticateToken, generalLimiter, FileController.deleteFile);
router.get('/serve/:filename', FileController.serveFile);
export default router;
//# sourceMappingURL=files.js.map