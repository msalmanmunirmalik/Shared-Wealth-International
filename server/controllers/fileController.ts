import { Request, Response } from 'express';
import { DatabaseService } from '../../src/integrations/postgresql/database.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import path from 'path';
import fs from 'fs';
import { ApiResponse } from '../types/index.js';

export class FileController {
  /**
   * Upload single file
   */
  static async uploadFile(req: AuthenticatedRequest, res: Response<ApiResponse<any>>) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const file = req.file;
      const uploadType = req.body.uploadType || 'general';
      const relatedEntityType = req.body.relatedEntityType || null;
      const relatedEntityId = req.body.relatedEntityId || null;

      // Validate file
      try {
        const allowedTypes = {
          images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
          documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
          logos: ['image/jpeg', 'image/png', 'image/svg+xml'],
          general: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
        };

        const maxSizes = {
          images: 5 * 1024 * 1024, // 5MB
          documents: 10 * 1024 * 1024, // 10MB
          logos: 2 * 1024 * 1024, // 2MB
          general: 10 * 1024 * 1024 // 10MB
        };

        const allowedMimeTypes = allowedTypes[uploadType as keyof typeof allowedTypes] || allowedTypes.general;
        const maxSize = maxSizes[uploadType as keyof typeof maxSizes] || maxSizes.general;

        if (!allowedMimeTypes.includes(file.mimetype)) {
          // Delete the uploaded file if validation fails
          fs.unlinkSync(file.path);
          return res.status(400).json({
            success: false,
            message: `Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`
          });
        }

        if (file.size > maxSize) {
          // Delete the uploaded file if validation fails
          fs.unlinkSync(file.path);
          return res.status(400).json({
            success: false,
            message: `File too large. Maximum size: ${Math.round(maxSize / 1024 / 1024)}MB`
          });
        }
      } catch (validationError) {
        // Delete the uploaded file if validation fails
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
        return res.status(400).json({
          success: false,
          message: validationError instanceof Error ? validationError.message : 'File validation failed'
        });
      }

      // Save file metadata to database
      const fileRecord = await DatabaseService.insert('file_uploads', {
        filename: file.filename,
        original_filename: file.originalname,
        file_path: file.path,
        file_size: file.size,
        mime_type: file.mimetype,
        upload_type: uploadType,
        uploaded_by: req.user?.id,
        related_entity_type: relatedEntityType,
        related_entity_id: relatedEntityId
      });

      // Generate public URL
      const publicUrl = `/uploads/${uploadType === 'logo' ? 'logos' : 
                        uploadType === 'document' ? 'documents' :
                        file.mimetype.startsWith('image/') ? 'images' : 'general'}/${file.filename}`;

      res.status(201).json({
        success: true,
        data: {
          id: fileRecord.id,
          filename: file.filename,
          originalName: file.originalname,
          size: file.size,
          mimeType: file.mimetype,
          uploadType: uploadType,
          publicUrl: publicUrl,
          uploadedAt: fileRecord.created_at
        }
      });
    } catch (error) {
      console.error('File upload error:', error);
      
      // Clean up uploaded file if database operation fails
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Upload multiple files
   */
  static async uploadMultipleFiles(req: AuthenticatedRequest, res: Response<ApiResponse<any>>) {
    try {
      if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded'
        });
      }

      const files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
      const uploadType = req.body.uploadType || 'general';
      const relatedEntityType = req.body.relatedEntityType || null;
      const relatedEntityId = req.body.relatedEntityId || null;

      const uploadedFiles: any[] = [];
      const errors: string[] = [];

      for (const file of files) {
        try {
          // Validate each file
          const allowedTypes = {
            images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
            documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
            logos: ['image/jpeg', 'image/png', 'image/svg+xml'],
            general: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
          };

          const maxSizes = {
            images: 5 * 1024 * 1024, // 5MB
            documents: 10 * 1024 * 1024, // 10MB
            logos: 2 * 1024 * 1024, // 2MB
            general: 10 * 1024 * 1024 // 10MB
          };

          const allowedMimeTypes = allowedTypes[uploadType as keyof typeof allowedTypes] || allowedTypes.general;
          const maxSize = maxSizes[uploadType as keyof typeof maxSizes] || maxSizes.general;

          if (!allowedMimeTypes.includes(file.mimetype)) {
            fs.unlinkSync(file.path);
            errors.push(`${file.originalname}: Invalid file type`);
            continue;
          }

          if (file.size > maxSize) {
            fs.unlinkSync(file.path);
            errors.push(`${file.originalname}: File too large`);
            continue;
          }

          // Save file metadata to database
          const fileRecord = await DatabaseService.insert('file_uploads', {
            filename: file.filename,
            original_filename: file.originalname,
            file_path: file.path,
            file_size: file.size,
            mime_type: file.mimetype,
            upload_type: uploadType,
            uploaded_by: req.user?.id,
            related_entity_type: relatedEntityType,
            related_entity_id: relatedEntityId
          });

          const publicUrl = `/uploads/${uploadType === 'logo' ? 'logos' : 
                            uploadType === 'document' ? 'documents' :
                            file.mimetype.startsWith('image/') ? 'images' : 'general'}/${file.filename}`;

          uploadedFiles.push({
            id: fileRecord.id,
            filename: file.filename,
            originalName: file.originalname,
            size: file.size,
            mimeType: file.mimetype,
            uploadType: uploadType,
            publicUrl: publicUrl,
            uploadedAt: fileRecord.created_at
          });
        } catch (fileError) {
          // Clean up file if database operation fails
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
          errors.push(`${file.originalname}: ${fileError instanceof Error ? fileError.message : 'Upload failed'}`);
        }
      }

      res.status(201).json({
        success: true,
        data: {
          uploadedFiles,
          errors: errors.length > 0 ? errors : undefined,
          summary: {
            total: files.length,
            successful: uploadedFiles.length,
            failed: errors.length
          }
        }
      });
    } catch (error) {
      console.error('Multiple file upload error:', error);
      
      // Clean up all uploaded files
      if (req.files) {
        const files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
        files.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get file by ID
   */
  static async getFile(req: Request, res: Response<ApiResponse<any>>) {
    try {
      const { id } = req.params;
      
      const file = await DatabaseService.findById('file_uploads', id);
      
      if (!file) {
        return res.status(404).json({
          success: false,
          message: 'File not found'
        });
      }

      // Check if file exists on disk
      if (!fs.existsSync(file.file_path)) {
        return res.status(404).json({
          success: false,
          message: 'File not found on disk'
        });
      }

      res.json({
        success: true,
        data: {
          id: file.id,
          filename: file.filename,
          originalName: file.original_filename,
          size: file.file_size,
          mimeType: file.mime_type,
          uploadType: file.upload_type,
          uploadedAt: file.created_at,
          uploadedBy: file.uploaded_by
        }
      });
    } catch (error) {
      console.error('Get file error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get files by user
   */
  static async getUserFiles(req: AuthenticatedRequest, res: Response<ApiResponse<any>>) {
    try {
      const userId = req.user?.id;
      const uploadType = req.query.uploadType as string;
      
      let whereClause: any = { uploaded_by: userId };
      if (uploadType) {
        whereClause.upload_type = uploadType;
      }

      const files = await DatabaseService.findAll('file_uploads', { 
        where: whereClause
      });

      const filesWithUrls = files.map(file => {
        const publicUrl = `/uploads/${file.upload_type === 'logo' ? 'logos' : 
                          file.upload_type === 'document' ? 'documents' :
                          file.mime_type.startsWith('image/') ? 'images' : 'general'}/${file.filename}`;
        
        return {
          id: file.id,
          filename: file.filename,
          originalName: file.original_filename,
          size: file.file_size,
          mimeType: file.mime_type,
          uploadType: file.upload_type,
          publicUrl: publicUrl,
          uploadedAt: file.created_at
        };
      });

      res.json({
        success: true,
        data: filesWithUrls
      });
    } catch (error) {
      console.error('Get user files error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Delete file
   */
  static async deleteFile(req: AuthenticatedRequest, res: Response<ApiResponse<any>>) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      
      const file = await DatabaseService.findById('file_uploads', id);
      
      if (!file) {
        return res.status(404).json({
          success: false,
          message: 'File not found'
        });
      }

      // Check if user owns the file or is admin
      if (file.uploaded_by !== userId && req.user?.role !== 'admin' && req.user?.role !== 'superadmin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this file'
        });
      }

      // Delete file from disk
      if (fs.existsSync(file.file_path)) {
        fs.unlinkSync(file.file_path);
      }

      // Delete file record from database
      await DatabaseService.delete('file_uploads', id);

      res.json({
        success: true,
        data: { message: 'File deleted successfully' }
      });
    } catch (error) {
      console.error('Delete file error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Serve file
   */
  static async serveFile(req: Request, res: Response) {
    try {
      const { filename } = req.params;
      const { type } = req.query;
      
      // Determine file path based on type
      let filePath: string;
      if (type === 'logo') {
        filePath = path.join('uploads', 'logos', filename);
      } else if (type === 'document') {
        filePath = path.join('uploads', 'documents', filename);
      } else if (type === 'image') {
        filePath = path.join('uploads', 'images', filename);
      } else {
        filePath = path.join('uploads', 'general', filename);
      }

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          message: 'File not found'
        });
      }

      // Get file stats
      const stats = fs.statSync(filePath);
      
      // Set appropriate headers
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Length', stats.size);
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      
      // Stream the file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
      
      fileStream.on('error', (error) => {
        console.error('File stream error:', error);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: 'Error reading file'
          });
        }
      });
    } catch (error) {
      console.error('Serve file error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}
