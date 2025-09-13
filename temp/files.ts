import { Router } from 'express';
import { FileController } from '../controllers/fileController.js';
import { authenticateToken } from '../middleware/auth.js';
import { uploadLogo, uploadDocument, uploadMultiple, handleUploadError } from '../middleware/fileUpload.js';
import { generalLimiter } from '../middleware/rateLimit.js';

const router: Router = Router();

/**
 * @swagger
 * /api/files/logo/{companyId}:
 *   post:
 *     summary: Upload company logo
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID
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
 *                 description: Logo image file
 *     responses:
 *       200:
 *         description: Logo uploaded successfully
 *       400:
 *         description: Invalid file or validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/logo/:companyId', 
  generalLimiter,
  authenticateToken,
  uploadLogo,
  handleUploadError,
  FileController.uploadLogo
);

/**
 * @swagger
 * /api/files/document:
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
 *                 description: Document file
 *               entityType:
 *                 type: string
 *                 description: Type of entity this file is related to
 *               entityId:
 *                 type: string
 *                 description: ID of the entity this file is related to
 *     responses:
 *       200:
 *         description: Document uploaded successfully
 *       400:
 *         description: Invalid file or validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/document',
  generalLimiter,
  authenticateToken,
  uploadDocument,
  handleUploadError,
  FileController.uploadDocument
);

/**
 * @swagger
 * /api/files/multiple:
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
 *                 description: Multiple files
 *               entityType:
 *                 type: string
 *                 description: Type of entity these files are related to
 *               entityId:
 *                 type: string
 *                 description: ID of the entity these files are related to
 *     responses:
 *       200:
 *         description: Files uploaded successfully
 *       400:
 *         description: Invalid files or validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/multiple',
  generalLimiter,
  authenticateToken,
  uploadMultiple,
  handleUploadError,
  FileController.uploadMultiple
);

/**
 * @swagger
 * /api/files/{fileId}:
 *   get:
 *     summary: Get file information
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *         description: File ID
 *     responses:
 *       200:
 *         description: File information retrieved successfully
 *       404:
 *         description: File not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/:fileId',
  generalLimiter,
  authenticateToken,
  FileController.getFileInfo
);

/**
 * @swagger
 * /api/files/{fileId}:
 *   delete:
 *     summary: Delete file
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *         description: File ID
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       404:
 *         description: File not found
 *       403:
 *         description: Permission denied
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete('/:fileId',
  generalLimiter,
  authenticateToken,
  FileController.deleteFile
);

/**
 * @swagger
 * /api/files/user/list:
 *   get:
 *     summary: List user's files
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of items per page
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [general, logo, document, image]
 *         description: File type filter
 *     responses:
 *       200:
 *         description: User files retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/user/list',
  generalLimiter,
  authenticateToken,
  FileController.listUserFiles
);

export default router;
