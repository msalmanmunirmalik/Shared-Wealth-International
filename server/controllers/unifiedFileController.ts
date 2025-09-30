import { Request, Response } from 'express';
import { UnifiedFileService } from '../services/unifiedFileService.js';
import { authenticateToken } from '../middleware/auth.js';
import { generalLimiter } from '../middleware/rateLimit.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Define allowed file types
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|mp4|mp3|wav/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, documents, and media files are allowed.'));
    }
  }
});

export class UnifiedFileController {
  /**
   * Upload single file
   */
  static async uploadFile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { context, contextId, description, tags } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
        return;
      }

      const fileData = {
        originalName: req.file.originalname,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
        context: context || 'general',
        contextId: contextId || null,
        description: description || '',
        tags: tags ? JSON.parse(tags) : [],
        uploadedBy: userId
      };

      const result = await UnifiedFileService.uploadFile(fileData);

      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          message: 'File uploaded successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to upload file'
        });
      }
    } catch (error) {
      console.error('Upload file error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Upload multiple files
   */
  static async uploadMultipleFiles(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { context, contextId, description, tags } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        res.status(400).json({
          success: false,
          message: 'No files uploaded'
        });
        return;
      }

      const files = req.files as Express.Multer.File[];
      const uploadedFiles: any[] = [];

      for (const file of files) {
        const fileData = {
          originalName: file.originalname,
          filename: file.filename,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path,
          context: context || 'general',
          contextId: contextId || null,
          description: description || '',
          tags: tags ? JSON.parse(tags) : [],
          uploadedBy: userId
        };

        const result = await UnifiedFileService.uploadFile(fileData);
        if (result.success) {
          uploadedFiles.push(result.data);
        }
      }

      res.json({
        success: true,
        data: uploadedFiles,
        message: `${uploadedFiles.length} files uploaded successfully`
      });
    } catch (error) {
      console.error('Upload multiple files error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get file by ID
   */
  static async getFile(req: Request, res: Response): Promise<void> {
    try {
      const { fileId } = req.params;
      const userId = (req as any).user?.id;

      const result = await UnifiedFileService.getFile(fileId, userId);

      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.status(404).json({
          success: false,
          message: result.message || 'File not found'
        });
      }
    } catch (error) {
      console.error('Get file error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Download file
   */
  static async downloadFile(req: Request, res: Response): Promise<void> {
    try {
      const { fileId } = req.params;
      const userId = (req as any).user?.id;

      const result = await UnifiedFileService.getFile(fileId, userId);

      if (!result.success || !result.data) {
        res.status(404).json({
          success: false,
          message: 'File not found'
        });
        return;
      }

      const file = result.data;
      const filePath = path.join(process.cwd(), 'uploads', file.filename);

      if (!fs.existsSync(filePath)) {
        res.status(404).json({
          success: false,
          message: 'File not found on disk'
        });
        return;
      }

      // Update download count
      await UnifiedFileService.incrementDownloadCount(fileId);

      res.download(filePath, file.originalName);
    } catch (error) {
      console.error('Download file error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get files by context
   */
  static async getFilesByContext(req: Request, res: Response): Promise<void> {
    try {
      const { context, contextId } = req.params;
      const { limit = '20', offset = '0', type, search } = req.query;
      const userId = (req as any).user?.id;

      const result = await UnifiedFileService.getFilesByContext(context, contextId, {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        type: type as string,
        search: search as string
      }, userId);

      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          pagination: {
            limit: parseInt(limit as string),
            offset: parseInt(offset as string),
            total: result.total || 0
          }
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to get files'
        });
      }
    } catch (error) {
      console.error('Get files by context error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get user's files
   */
  static async getUserFiles(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { limit = '20', offset = '0', type, search } = req.query;
      const authUserId = (req as any).user?.id;

      // Users can only view their own files unless they're admin
      if (authUserId !== userId && (req as any).user?.role !== 'admin') {
        res.status(403).json({
          success: false,
          message: 'Unauthorized to view these files'
        });
        return;
      }

      const result = await UnifiedFileService.getUserFiles(userId, {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        type: type as string,
        search: search as string
      });

      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          pagination: {
            limit: parseInt(limit as string),
            offset: parseInt(offset as string),
            total: result.total || 0
          }
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to get user files'
        });
      }
    } catch (error) {
      console.error('Get user files error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Update file metadata
   */
  static async updateFile(req: Request, res: Response): Promise<void> {
    try {
      const { fileId } = req.params;
      const { description, tags, isPublic } = req.body;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const result = await UnifiedFileService.updateFile(fileId, {
        description,
        tags,
        isPublic
      }, userId);

      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          message: 'File updated successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to update file'
        });
      }
    } catch (error) {
      console.error('Update file error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Delete file
   */
  static async deleteFile(req: Request, res: Response): Promise<void> {
    try {
      const { fileId } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const result = await UnifiedFileService.deleteFile(fileId, userId);

      if (result.success) {
        res.json({
          success: true,
          message: 'File deleted successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to delete file'
        });
      }
    } catch (error) {
      console.error('Delete file error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Share file
   */
  static async shareFile(req: Request, res: Response): Promise<void> {
    try {
      const { fileId } = req.params;
      const { shareType, recipients, message, expiresAt } = req.body;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const result = await UnifiedFileService.shareFile(fileId, {
        shareType,
        recipients,
        message,
        expiresAt
      }, userId);

      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          message: 'File shared successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to share file'
        });
      }
    } catch (error) {
      console.error('Share file error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get file shares
   */
  static async getFileShares(req: Request, res: Response): Promise<void> {
    try {
      const { fileId } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const result = await UnifiedFileService.getFileShares(fileId, userId);

      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to get file shares'
        });
      }
    } catch (error) {
      console.error('Get file shares error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get file analytics
   */
  static async getFileAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const { fileId } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const result = await UnifiedFileService.getFileAnalytics(fileId, userId);

      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to get file analytics'
        });
      }
    } catch (error) {
      console.error('Get file analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get file storage statistics
   */
  static async getStorageStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const result = await UnifiedFileService.getStorageStats(userId);

      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message || 'Failed to get storage stats'
        });
      }
    } catch (error) {
      console.error('Get storage stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

// Export multer middleware for use in routes
export { upload };
