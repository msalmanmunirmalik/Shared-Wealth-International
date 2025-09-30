import { Router, type Router as ExpressRouter } from 'express';
import { UnifiedFileController, upload } from '../controllers/unifiedFileController.js';
import { authenticateToken } from '../middleware/auth.js';
import { generalLimiter } from '../middleware/rateLimit.js';

const router: ExpressRouter = Router();

/**
 * @swagger
 * /api/files/upload:
 *   post:
 *     summary: Upload single file
 *     tags: [Unified Files]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to upload
 *               context:
 *                 type: string
 *                 description: Context for the file (e.g., 'company', 'user', 'content')
 *               contextId:
 *                 type: string
 *                 description: ID of the context entity
 *               description:
 *                 type: string
 *                 description: File description
 *               tags:
 *                 type: string
 *                 description: JSON string of tags
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/upload', authenticateToken, generalLimiter, upload.single('file'), UnifiedFileController.uploadFile);

/**
 * @swagger
 * /api/files/upload/multiple:
 *   post:
 *     summary: Upload multiple files
 *     tags: [Unified Files]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - files
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Files to upload
 *               context:
 *                 type: string
 *                 description: Context for the files
 *               contextId:
 *                 type: string
 *                 description: ID of the context entity
 *               description:
 *                 type: string
 *                 description: Files description
 *               tags:
 *                 type: string
 *                 description: JSON string of tags
 *     responses:
 *       200:
 *         description: Files uploaded successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/upload/multiple', authenticateToken, generalLimiter, upload.array('files', 10), UnifiedFileController.uploadMultipleFiles);

/**
 * @swagger
 * /api/files/{fileId}:
 *   get:
 *     summary: Get file information
 *     tags: [Unified Files]
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
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: File not found
 *       500:
 *         description: Internal server error
 */
router.get('/:fileId', authenticateToken, generalLimiter, UnifiedFileController.getFile);

/**
 * @swagger
 * /api/files/{fileId}/download:
 *   get:
 *     summary: Download file
 *     tags: [Unified Files]
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
 *         description: File downloaded successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: File not found
 *       500:
 *         description: Internal server error
 */
router.get('/:fileId/download', authenticateToken, generalLimiter, UnifiedFileController.downloadFile);

/**
 * @swagger
 * /api/files/context/{context}/{contextId}:
 *   get:
 *     summary: Get files by context
 *     tags: [Unified Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: context
 *         required: true
 *         schema:
 *           type: string
 *         description: Context type (e.g., 'company', 'user', 'content')
 *       - in: path
 *         name: contextId
 *         required: true
 *         schema:
 *           type: string
 *         description: Context ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of files to retrieve
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of files to skip
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by file type
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *     responses:
 *       200:
 *         description: Files retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/context/:context/:contextId', authenticateToken, generalLimiter, UnifiedFileController.getFilesByContext);

/**
 * @swagger
 * /api/files/user/{userId}:
 *   get:
 *     summary: Get user's files
 *     tags: [Unified Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of files to retrieve
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of files to skip
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by file type
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *     responses:
 *       200:
 *         description: User files retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get('/user/:userId', authenticateToken, generalLimiter, UnifiedFileController.getUserFiles);

/**
 * @swagger
 * /api/files/{fileId}:
 *   put:
 *     summary: Update file metadata
 *     tags: [Unified Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *         description: File ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: File description
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: File tags
 *               isPublic:
 *                 type: boolean
 *                 description: Whether file is public
 *     responses:
 *       200:
 *         description: File updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.put('/:fileId', authenticateToken, generalLimiter, UnifiedFileController.updateFile);

/**
 * @swagger
 * /api/files/{fileId}:
 *   delete:
 *     summary: Delete file
 *     tags: [Unified Files]
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
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete('/:fileId', authenticateToken, generalLimiter, UnifiedFileController.deleteFile);

/**
 * @swagger
 * /api/files/{fileId}/share:
 *   post:
 *     summary: Share file
 *     tags: [Unified Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *         description: File ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shareType
 *             properties:
 *               shareType:
 *                 type: string
 *                 enum: [public, private, restricted]
 *                 description: Type of sharing
 *               recipients:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of recipient user IDs
 *               message:
 *                 type: string
 *                 description: Share message
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *                 description: Share expiration date
 *     responses:
 *       200:
 *         description: File shared successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/:fileId/share', authenticateToken, generalLimiter, UnifiedFileController.shareFile);

/**
 * @swagger
 * /api/files/{fileId}/shares:
 *   get:
 *     summary: Get file shares
 *     tags: [Unified Files]
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
 *         description: File shares retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/:fileId/shares', authenticateToken, generalLimiter, UnifiedFileController.getFileShares);

/**
 * @swagger
 * /api/files/{fileId}/analytics:
 *   get:
 *     summary: Get file analytics
 *     tags: [Unified Files]
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
 *         description: File analytics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/:fileId/analytics', authenticateToken, generalLimiter, UnifiedFileController.getFileAnalytics);

/**
 * @swagger
 * /api/files/storage/stats:
 *   get:
 *     summary: Get storage statistics
 *     tags: [Unified Files]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Storage statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/storage/stats', authenticateToken, generalLimiter, UnifiedFileController.getStorageStats);

export default router;
