import { Request, Response } from 'express';
import { DatabaseService } from '../../src/integrations/postgresql/database.js';
import { 
  processLogo, 
  cleanupFile, 
  validateFile, 
  generateFileUrl,
  getFileInfo 
} from '../middleware/fileUpload.js';
import path from 'path';
import fs from 'fs';

// Extend Express Request type to include file upload properties
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
  file?: any; // Multer file
  files?: any[]; // Multer files array
}

export class FileController {
  /**
   * Upload company logo
   */
  static async uploadLogo(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      // Validate file
      const validation = validateFile(req.file);
      if (!validation.isValid) {
        // Clean up uploaded file
        await cleanupFile(req.file.path);
        return res.status(400).json({
          success: false,
          message: 'File validation failed',
          errors: validation.errors
        });
      }

      const { companyId } = req.params;
      
      // Process logo (create different sizes)
      const processedFiles = await processLogo(req.file.path, path.dirname(req.file.path));
      
      // Generate URLs for different sizes
      const logoUrls = processedFiles.map(file => ({
        size: file.size,
        url: generateFileUrl(file.path),
        width: file.width,
        height: file.height
      }));

      // Save file info to database
      const fileRecord = await DatabaseService.insert('file_uploads', {
        filename: req.file.filename,
        original_filename: req.file.originalname,
        file_path: req.file.path,
        file_size: req.file.size,
        mime_type: req.file.mimetype,
        upload_type: 'logo',
        uploaded_by: req.user?.id,
        related_entity_type: 'company',
        related_entity_id: companyId
      });

      // Update company with logo URL
      if (companyId) {
        await DatabaseService.update('companies', companyId, {
          logo_url: logoUrls.find(l => l.size === 'medium')?.url || generateFileUrl(req.file.path),
          logo_file_path: req.file.path
        });
      }

      res.json({
        success: true,
        message: 'Logo uploaded successfully',
        data: {
          fileId: fileRecord.id,
          originalFile: {
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size,
            url: generateFileUrl(req.file.path)
          },
          processedFiles: logoUrls
        }
      });

    } catch (error) {
      console.error('Logo upload error:', error);
      
      // Clean up file on error
      if (req.file) {
        await cleanupFile(req.file.path);
      }

      res.status(500).json({
        success: false,
        message: 'Failed to upload logo',
        error: (error as Error).message
      });
    }
  }

  /**
   * Upload document
   */
  static async uploadDocument(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      // Validate file
      const validation = validateFile(req.file);
      if (!validation.isValid) {
        await cleanupFile(req.file.path);
        return res.status(400).json({
          success: false,
          message: 'File validation failed',
          errors: validation.errors
        });
      }

      // Save file info to database
      const fileRecord = await DatabaseService.insert('file_uploads', {
        filename: req.file.filename,
        original_filename: req.file.originalname,
        file_path: req.file.path,
        file_size: req.file.size,
        mime_type: req.file.mimetype,
        upload_type: 'document',
        uploaded_by: req.user?.id,
        related_entity_type: req.body.entityType || 'general',
        related_entity_id: req.body.entityId || null
      });

      res.json({
        success: true,
        message: 'Document uploaded successfully',
        data: {
          fileId: fileRecord.id,
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size,
          url: generateFileUrl(req.file.path),
          mimeType: req.file.mimetype
        }
      });

    } catch (error) {
      console.error('Document upload error:', error);
      
      if (req.file) {
        await cleanupFile(req.file.path);
      }

      res.status(500).json({
        success: false,
        message: 'Failed to upload document',
        error: (error as Error).message
      });
    }
  }

  /**
   * Upload multiple files
   */
  static async uploadMultiple(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded'
        });
      }

      const uploadedFiles: any[] = [];
      const errors: any[] = [];

      for (const file of req.files as any[]) {
        try {
          // Validate file
          const validation = validateFile(file);
          if (!validation.isValid) {
            await cleanupFile(file.path);
            errors.push({
              filename: file.originalname,
              errors: validation.errors
            });
            continue;
          }

          // Save file info to database
          const fileRecord = await DatabaseService.insert('file_uploads', {
            filename: file.filename,
            original_filename: file.originalname,
            file_path: file.path,
            file_size: file.size,
            mime_type: file.mimetype,
            upload_type: 'general',
            uploaded_by: req.user?.id,
            related_entity_type: req.body.entityType || 'general',
            related_entity_id: req.body.entityId || null
          });

          uploadedFiles.push({
            fileId: fileRecord.id,
            filename: file.filename,
            originalName: file.originalname,
            size: file.size,
            url: generateFileUrl(file.path),
            mimeType: file.mimetype
          });

        } catch (error) {
          console.error(`Error processing file ${file.originalname}:`, error);
          await cleanupFile(file.path);
          errors.push({
            filename: file.originalname,
            error: (error as Error).message
          });
        }
      }

      res.json({
        success: true,
        message: `${uploadedFiles.length} files uploaded successfully`,
        data: {
          uploadedFiles,
          errors: errors.length > 0 ? errors : undefined
        }
      });

    } catch (error) {
      console.error('Multiple file upload error:', error);
      
      // Clean up all files on error
      if (req.files) {
        for (const file of req.files as any[]) {
          await cleanupFile(file.path);
        }
      }

      res.status(500).json({
        success: false,
        message: 'Failed to upload files',
        error: (error as Error).message
      });
    }
  }

  /**
   * Get file information
   */
  static async getFileInfo(req: AuthenticatedRequest, res: Response) {
    try {
      const { fileId } = req.params;

      const fileRecord = await DatabaseService.findById('file_uploads', fileId);
      if (!fileRecord) {
        return res.status(404).json({
          success: false,
          message: 'File not found'
        });
      }

      // Check if file exists on disk
      const fileExists = fs.existsSync(fileRecord.file_path);
      const fileInfo = fileExists ? getFileInfo(fileRecord.file_path) : null;

      res.json({
        success: true,
        data: {
          ...fileRecord,
          exists: fileExists,
          fileInfo,
          url: generateFileUrl(fileRecord.file_path)
        }
      });

    } catch (error) {
      console.error('Get file info error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get file information',
        error: (error as Error).message
      });
    }
  }

  /**
   * Delete file
   */
  static async deleteFile(req: AuthenticatedRequest, res: Response) {
    try {
      const { fileId } = req.params;

      const fileRecord = await DatabaseService.findById('file_uploads', fileId);
      if (!fileRecord) {
        return res.status(404).json({
          success: false,
          message: 'File not found'
        });
      }

      // Check if user has permission to delete
      if (fileRecord.uploaded_by !== req.user?.id && req.user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Permission denied'
        });
      }

      // Delete file from disk
      await cleanupFile(fileRecord.file_path);

      // Delete record from database
      await DatabaseService.delete('file_uploads', fileId);

      res.json({
        success: true,
        message: 'File deleted successfully'
      });

    } catch (error) {
      console.error('Delete file error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete file',
        error: (error as Error).message
      });
    }
  }

  /**
   * List user's files
   */
  static async listUserFiles(req: AuthenticatedRequest, res: Response) {
    try {
      const { page = 1, limit = 20, type } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const whereClause: any = { uploaded_by: req.user?.id };
      if (type) {
        whereClause.upload_type = type;
      }

      const files = await DatabaseService.findAll('file_uploads', {
        where: whereClause,
        limit: Number(limit),
        offset: Number(offset)
      });

      // Add URLs to each file
      const filesWithUrls = files.map(file => ({
        ...file,
        url: generateFileUrl(file.file_path),
        exists: fs.existsSync(file.file_path)
      }));

      res.json({
        success: true,
        data: filesWithUrls,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: files.length
        }
      });

    } catch (error) {
      console.error('List user files error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to list files',
        error: (error as Error).message
      });
    }
  }
}
