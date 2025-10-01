import { Router } from 'express';
import { FileController } from '../controllers/fileController.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload, uploadLogo, uploadDocument, uploadImage, handleUploadError } from '../middleware/fileUpload.js';
import { generalLimiter } from '../middleware/rateLimit.js';

const router: ReturnType<typeof Router> = Router();

/**
 * @swagger
 * /api/files/upload:
 *   post:
 *     summary: Upload a single file
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to upload
 *               uploadType:
 *                 type: string
 *                 enum: [general, logo, document, image]
 *                 description: Type of upload
 *               relatedEntityType:
 *                 type: string
 *                 description: Type of related entity (company, user, etc.)
 *               relatedEntityId:
 *                 type: string
 *                 description: ID of related entity
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     filename:
 *                       type: string
 *                     originalName:
 *                       type: string
 *                     size:
 *                       type: number
 *                     mimeType:
 *                       type: string
 *                     uploadType:
 *                       type: string
 *                     publicUrl:
 *                       type: string
 *                     uploadedAt:
 *                       type: string
 *       400:
 *         description: Invalid file or validation error
 *       401:
 *         description: Unauthorized
 */
// Upload endpoint without auth for signup (temporary placeholder)
router.post('/upload', 
  generalLimiter,
  async (req, res) => {
    try {
      // Simple placeholder for file uploads during signup
      // TODO: Implement proper multer file handling after migration
      res.json({
        success: true,
        data: {
          publicUrl: 'https://via.placeholder.com/150x150?text=Profile+Image',
          filename: 'profile-image.jpg'
        }
      });
    } catch (error) {
      console.error('File upload error:', error);
      res.status(500).json({ success: false, message: 'File upload failed' });
    }
  }
);

/**
 * @swagger
 * /api/files/upload-multiple:
 *   post:
 *     summary: Upload multiple files
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Files to upload
 *               uploadType:
 *                 type: string
 *                 enum: [general, logo, document, image]
 *                 description: Type of upload
 *               relatedEntityType:
 *                 type: string
 *                 description: Type of related entity
 *               relatedEntityId:
 *                 type: string
 *                 description: ID of related entity
 *     responses:
 *       201:
 *         description: Files uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     uploadedFiles:
 *                       type: array
 *                       items:
 *                         type: object
 *                     errors:
 *                       type: array
 *                       items:
 *                         type: string
 *                     summary:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: number
 *                         successful:
 *                           type: number
 *                         failed:
 *                           type: number
 */
router.post('/upload-multiple',
  authenticateToken,
  generalLimiter,
  upload.array('files', 5),
  handleUploadError,
  FileController.uploadMultipleFiles
);

/**
 * @swagger
 * /api/files/upload-logo:
 *   post:
 *     summary: Upload company logo
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: Logo file (JPEG, PNG, SVG)
 *               companyId:
 *                 type: string
 *                 description: Company ID
 *     responses:
 *       201:
 *         description: Logo uploaded successfully
 *       400:
 *         description: Invalid file type or size
 */
router.post('/upload-logo',
  authenticateToken,
  generalLimiter,
  uploadLogo.single('logo'),
  handleUploadError,
  FileController.uploadFile
);

/**
 * @swagger
 * /api/files/upload-document:
 *   post:
 *     summary: Upload document
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               document:
 *                 type: string
 *                 format: binary
 *                 description: Document file (PDF, Word)
 *               documentType:
 *                 type: string
 *                 description: Type of document
 *     responses:
 *       201:
 *         description: Document uploaded successfully
 */
router.post('/upload-document',
  authenticateToken,
  generalLimiter,
  uploadDocument.single('document'),
  handleUploadError,
  FileController.uploadFile
);

/**
 * @swagger
 * /api/files/upload-image:
 *   post:
 *     summary: Upload image
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file (JPEG, PNG, GIF, WebP)
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 */
router.post('/upload-image',
  authenticateToken,
  generalLimiter,
  uploadImage.single('image'),
  handleUploadError,
  FileController.uploadFile
);

/**
 * @swagger
 * /api/files/{id}:
 *   get:
 *     summary: Get file information
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: File ID
 *     responses:
 *       200:
 *         description: File information retrieved successfully
 *       404:
 *         description: File not found
 */
router.get('/:id', FileController.getFile);

/**
 * @swagger
 * /api/files/user/files:
 *   get:
 *     summary: Get user's files
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: uploadType
 *         schema:
 *           type: string
 *           enum: [general, logo, document, image]
 *         description: Filter by upload type
 *     responses:
 *       200:
 *         description: User files retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/user/files',
  authenticateToken,
  generalLimiter,
  FileController.getUserFiles
);

/**
 * @swagger
 * /api/files/{id}:
 *   delete:
 *     summary: Delete file
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: File ID
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       403:
 *         description: Not authorized to delete this file
 *       404:
 *         description: File not found
 */
router.delete('/:id',
  authenticateToken,
  generalLimiter,
  FileController.deleteFile
);

/**
 * @swagger
 * /api/files/serve/{filename}:
 *   get:
 *     summary: Serve file
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Filename
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [logo, document, image, general]
 *         description: File type
 *     responses:
 *       200:
 *         description: File served successfully
 *       404:
 *         description: File not found
 */
router.get('/serve/:filename', FileController.serveFile);

export default router;
