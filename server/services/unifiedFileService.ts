import { DatabaseService } from '../../src/integrations/postgresql/database.js';
import { ApiResponse } from '../types/api.js';
import fs from 'fs';
import path from 'path';

export interface FileData {
  originalName: string;
  filename: string;
  mimetype: string;
  size: number;
  path: string;
  context: string;
  contextId?: string;
  description?: string;
  tags?: string[];
  uploadedBy: string;
}

export interface FileFilters {
  limit?: number;
  offset?: number;
  type?: string;
  search?: string;
}

export interface FileShareData {
  shareType: string;
  recipients?: string[];
  message?: string;
  expiresAt?: string;
}

export interface FileUpdateData {
  description?: string;
  tags?: string[];
  isPublic?: boolean;
}

export class UnifiedFileService {
  /**
   * Upload file to database and filesystem
   */
  static async uploadFile(fileData: FileData): Promise<ApiResponse<any>> {
    try {
      const {
        originalName,
        filename,
        mimetype,
        size,
        path: filePath,
        context,
        contextId,
        description,
        tags,
        uploadedBy
      } = fileData;

      // Insert file record into database
      const insertQuery = `
        INSERT INTO file_uploads (
          original_name, filename, mimetype, size, file_path, context, context_id,
          description, tags, uploaded_by, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
        RETURNING *
      `;

      const result = await DatabaseService.query(insertQuery, [
        originalName,
        filename,
        mimetype,
        size,
        filePath,
        context,
        contextId,
        description || '',
        JSON.stringify(tags || []),
        uploadedBy
      ]);

      if (result.rows.length > 0) {
        return {
          success: true,
          data: result.rows[0]
        };
      } else {
        return {
          success: false,
          message: 'Failed to save file record'
        };
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      return {
        success: false,
        message: 'Failed to upload file'
      };
    }
  }

  /**
   * Get file by ID
   */
  static async getFile(fileId: string, userId: string): Promise<ApiResponse<any>> {
    try {
      const query = `
        SELECT 
          fu.*,
          u.first_name || ' ' || u.last_name as uploaded_by_name,
          u.email as uploaded_by_email
        FROM file_uploads fu
        JOIN users u ON fu.uploaded_by = u.id
        WHERE fu.id = $1
      `;

      const result = await DatabaseService.query(query, [fileId]);

      if (result.rows.length > 0) {
        const file = result.rows[0];
        
        // Check if user has access to this file
        const hasAccess = await this.checkFileAccess(fileId, userId);
        if (!hasAccess) {
          return {
            success: false,
            message: 'Unauthorized to access this file'
          };
        }

        return {
          success: true,
          data: file
        };
      } else {
        return {
          success: false,
          message: 'File not found'
        };
      }
    } catch (error) {
      console.error('Error getting file:', error);
      return {
        success: false,
        message: 'Failed to get file'
      };
    }
  }

  /**
   * Get files by context
   */
  static async getFilesByContext(context: string, contextId: string, filters: FileFilters, userId: string): Promise<ApiResponse<any[]>> {
    try {
      let whereCondition = 'WHERE fu.context = $1 AND fu.context_id = $2';
      let queryParams: any[] = [context, contextId];
      let paramIndex = 3;

      // Add access control
      whereCondition += ` AND (fu.uploaded_by = $${paramIndex} OR fu.is_public = true)`;
      queryParams.push(userId);
      paramIndex++;

      if (filters.type) {
        whereCondition += ` AND fu.mimetype LIKE $${paramIndex}`;
        queryParams.push(`%${filters.type}%`);
        paramIndex++;
      }

      if (filters.search) {
        whereCondition += ` AND (fu.original_name ILIKE $${paramIndex} OR fu.description ILIKE $${paramIndex})`;
        queryParams.push(`%${filters.search}%`);
        paramIndex++;
      }

      const query = `
        SELECT 
          fu.*,
          u.first_name || ' ' || u.last_name as uploaded_by_name
        FROM file_uploads fu
        JOIN users u ON fu.uploaded_by = u.id
        ${whereCondition}
        ORDER BY fu.created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;

      queryParams.push(filters.limit || 20, filters.offset || 0);

      const result = await DatabaseService.query(query, queryParams);

      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total
        FROM file_uploads fu
        ${whereCondition}
      `;
      const countResult = await DatabaseService.query(countQuery, queryParams.slice(0, -2));
      const total = parseInt(countResult.rows[0]?.total || '0');

      return {
        success: true,
        data: result.rows || [],
        total
      };
    } catch (error) {
      console.error('Error getting files by context:', error);
      return {
        success: false,
        message: 'Failed to get files',
        data: []
      };
    }
  }

  /**
   * Get user's files
   */
  static async getUserFiles(userId: string, filters: FileFilters): Promise<ApiResponse<any[]>> {
    try {
      let whereCondition = 'WHERE fu.uploaded_by = $1';
      let queryParams: any[] = [userId];
      let paramIndex = 2;

      if (filters.type) {
        whereCondition += ` AND fu.mimetype LIKE $${paramIndex}`;
        queryParams.push(`%${filters.type}%`);
        paramIndex++;
      }

      if (filters.search) {
        whereCondition += ` AND (fu.original_name ILIKE $${paramIndex} OR fu.description ILIKE $${paramIndex})`;
        queryParams.push(`%${filters.search}%`);
        paramIndex++;
      }

      const query = `
        SELECT 
          fu.*,
          u.first_name || ' ' || u.last_name as uploaded_by_name
        FROM file_uploads fu
        JOIN users u ON fu.uploaded_by = u.id
        ${whereCondition}
        ORDER BY fu.created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;

      queryParams.push(filters.limit || 20, filters.offset || 0);

      const result = await DatabaseService.query(query, queryParams);

      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total
        FROM file_uploads fu
        ${whereCondition}
      `;
      const countResult = await DatabaseService.query(countQuery, queryParams.slice(0, -2));
      const total = parseInt(countResult.rows[0]?.total || '0');

      return {
        success: true,
        data: result.rows || [],
        total
      };
    } catch (error) {
      console.error('Error getting user files:', error);
      return {
        success: false,
        message: 'Failed to get user files',
        data: []
      };
    }
  }

  /**
   * Update file metadata
   */
  static async updateFile(fileId: string, updateData: FileUpdateData, userId: string): Promise<ApiResponse<any>> {
    try {
      // Check if user has access to update this file
      const hasAccess = await this.checkFileAccess(fileId, userId);
      if (!hasAccess) {
        return {
          success: false,
          message: 'Unauthorized to update this file'
        };
      }

      const fieldsToUpdate: { [key: string]: any } = {};
      if (updateData.description !== undefined) fieldsToUpdate.description = updateData.description;
      if (updateData.tags !== undefined) fieldsToUpdate.tags = JSON.stringify(updateData.tags);
      if (updateData.isPublic !== undefined) fieldsToUpdate.is_public = updateData.isPublic;

      const result = await DatabaseService.update('file_uploads', fileId, fieldsToUpdate);

      if (result.length > 0) {
        return {
          success: true,
          data: result[0]
        };
      } else {
        return {
          success: false,
          message: 'Failed to update file'
        };
      }
    } catch (error) {
      console.error('Error updating file:', error);
      return {
        success: false,
        message: 'Failed to update file'
      };
    }
  }

  /**
   * Delete file
   */
  static async deleteFile(fileId: string, userId: string): Promise<ApiResponse<boolean>> {
    try {
      // Check if user has access to delete this file
      const hasAccess = await this.checkFileAccess(fileId, userId);
      if (!hasAccess) {
        return {
          success: false,
          message: 'Unauthorized to delete this file'
        };
      }

      // Get file info before deletion
      const fileQuery = `
        SELECT filename, file_path FROM file_uploads WHERE id = $1
      `;
      const fileResult = await DatabaseService.query(fileQuery, [fileId]);

      if (fileResult.rows.length === 0) {
        return {
          success: false,
          message: 'File not found'
        };
      }

      const file = fileResult.rows[0];

      // Delete from database
      const deleteResult = await DatabaseService.delete('file_uploads', fileId);

      if (deleteResult) {
        // Delete physical file
        const filePath = path.join(process.cwd(), 'uploads', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        return {
          success: true,
          data: true
        };
      } else {
        return {
          success: false,
          message: 'Failed to delete file'
        };
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      return {
        success: false,
        message: 'Failed to delete file'
      };
    }
  }

  /**
   * Share file
   */
  static async shareFile(fileId: string, shareData: FileShareData, userId: string): Promise<ApiResponse<any>> {
    try {
      // Check if user has access to share this file
      const hasAccess = await this.checkFileAccess(fileId, userId);
      if (!hasAccess) {
        return {
          success: false,
          message: 'Unauthorized to share this file'
        };
      }

      const { shareType, recipients, message, expiresAt } = shareData;

      const insertQuery = `
        INSERT INTO file_shares (
          file_id, shared_by, share_type, recipients, message, expires_at, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
        RETURNING *
      `;

      const result = await DatabaseService.query(insertQuery, [
        fileId,
        userId,
        shareType,
        JSON.stringify(recipients || []),
        message || '',
        expiresAt || null
      ]);

      if (result.rows.length > 0) {
        return {
          success: true,
          data: result.rows[0]
        };
      } else {
        return {
          success: false,
          message: 'Failed to share file'
        };
      }
    } catch (error) {
      console.error('Error sharing file:', error);
      return {
        success: false,
        message: 'Failed to share file'
      };
    }
  }

  /**
   * Get file shares
   */
  static async getFileShares(fileId: string, userId: string): Promise<ApiResponse<any[]>> {
    try {
      // Check if user has access to view shares for this file
      const hasAccess = await this.checkFileAccess(fileId, userId);
      if (!hasAccess) {
        return {
          success: false,
          message: 'Unauthorized to view file shares'
        };
      }

      const query = `
        SELECT 
          fs.*,
          u.first_name || ' ' || u.last_name as shared_by_name
        FROM file_shares fs
        JOIN users u ON fs.shared_by = u.id
        WHERE fs.file_id = $1
        ORDER BY fs.created_at DESC
      `;

      const result = await DatabaseService.query(query, [fileId]);

      return {
        success: true,
        data: result.rows || []
      };
    } catch (error) {
      console.error('Error getting file shares:', error);
      return {
        success: false,
        message: 'Failed to get file shares',
        data: []
      };
    }
  }

  /**
   * Get file analytics
   */
  static async getFileAnalytics(fileId: string, userId: string): Promise<ApiResponse<any>> {
    try {
      // Check if user has access to view analytics for this file
      const hasAccess = await this.checkFileAccess(fileId, userId);
      if (!hasAccess) {
        return {
          success: false,
          message: 'Unauthorized to view file analytics'
        };
      }

      const query = `
        SELECT 
          fu.download_count,
          fu.view_count,
          COUNT(fs.id) as share_count,
          COUNT(fs.id) FILTER (WHERE fs.created_at > NOW() - INTERVAL '7 days') as recent_shares,
          COUNT(fs.id) FILTER (WHERE fs.created_at > NOW() - INTERVAL '30 days') as monthly_shares
        FROM file_uploads fu
        LEFT JOIN file_shares fs ON fu.id = fs.file_id
        WHERE fu.id = $1
        GROUP BY fu.id, fu.download_count, fu.view_count
      `;

      const result = await DatabaseService.query(query, [fileId]);

      return {
        success: true,
        data: result.rows[0] || {
          download_count: 0,
          view_count: 0,
          share_count: 0,
          recent_shares: 0,
          monthly_shares: 0
        }
      };
    } catch (error) {
      console.error('Error getting file analytics:', error);
      return {
        success: false,
        message: 'Failed to get file analytics',
        data: {}
      };
    }
  }

  /**
   * Get storage statistics for user
   */
  static async getStorageStats(userId: string): Promise<ApiResponse<any>> {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_files,
          SUM(size) as total_size,
          COUNT(*) FILTER (WHERE mimetype LIKE 'image/%') as image_count,
          COUNT(*) FILTER (WHERE mimetype LIKE 'video/%') as video_count,
          COUNT(*) FILTER (WHERE mimetype LIKE 'audio/%') as audio_count,
          COUNT(*) FILTER (WHERE mimetype LIKE 'application/pdf') as pdf_count,
          COUNT(*) FILTER (WHERE mimetype LIKE 'application/msword%') as doc_count,
          COUNT(*) FILTER (WHERE mimetype LIKE 'application/vnd.ms-excel%') as excel_count,
          COUNT(*) FILTER (WHERE mimetype LIKE 'application/vnd.ms-powerpoint%') as ppt_count
        FROM file_uploads
        WHERE uploaded_by = $1
      `;

      const result = await DatabaseService.query(query, [userId]);

      const stats = result.rows[0] || {};
      
      // Convert bytes to human readable format
      const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      };

      return {
        success: true,
        data: {
          ...stats,
          total_size_formatted: formatBytes(parseInt(stats.total_size || '0')),
          total_size_bytes: parseInt(stats.total_size || '0')
        }
      };
    } catch (error) {
      console.error('Error getting storage stats:', error);
      return {
        success: false,
        message: 'Failed to get storage stats',
        data: {}
      };
    }
  }

  /**
   * Increment download count
   */
  static async incrementDownloadCount(fileId: string): Promise<ApiResponse<boolean>> {
    try {
      const query = `
        UPDATE file_uploads
        SET download_count = download_count + 1, updated_at = NOW()
        WHERE id = $1
        RETURNING id
      `;

      const result = await DatabaseService.query(query, [fileId]);

      return {
        success: result.rows.length > 0,
        data: result.rows.length > 0
      };
    } catch (error) {
      console.error('Error incrementing download count:', error);
      return {
        success: false,
        message: 'Failed to increment download count'
      };
    }
  }

  /**
   * Increment view count
   */
  static async incrementViewCount(fileId: string): Promise<ApiResponse<boolean>> {
    try {
      const query = `
        UPDATE file_uploads
        SET view_count = view_count + 1, updated_at = NOW()
        WHERE id = $1
        RETURNING id
      `;

      const result = await DatabaseService.query(query, [fileId]);

      return {
        success: result.rows.length > 0,
        data: result.rows.length > 0
      };
    } catch (error) {
      console.error('Error incrementing view count:', error);
      return {
        success: false,
        message: 'Failed to increment view count'
      };
    }
  }

  /**
   * Check if user has access to file
   */
  private static async checkFileAccess(fileId: string, userId: string): Promise<boolean> {
    try {
      const query = `
        SELECT 
          uploaded_by, is_public,
          CASE 
            WHEN uploaded_by = $2 THEN true
            WHEN is_public = true THEN true
            ELSE false
          END as has_access
        FROM file_uploads
        WHERE id = $1
      `;

      const result = await DatabaseService.query(query, [fileId, userId]);

      if (result.rows.length > 0) {
        return result.rows[0].has_access;
      }

      return false;
    } catch (error) {
      console.error('Error checking file access:', error);
      return false;
    }
  }

  /**
   * Get file type category
   */
  static getFileTypeCategory(mimetype: string): string {
    if (mimetype.startsWith('image/')) return 'image';
    if (mimetype.startsWith('video/')) return 'video';
    if (mimetype.startsWith('audio/')) return 'audio';
    if (mimetype === 'application/pdf') return 'pdf';
    if (mimetype.includes('word') || mimetype.includes('document')) return 'document';
    if (mimetype.includes('excel') || mimetype.includes('spreadsheet')) return 'spreadsheet';
    if (mimetype.includes('powerpoint') || mimetype.includes('presentation')) return 'presentation';
    if (mimetype.includes('text/')) return 'text';
    return 'other';
  }

  /**
   * Get file icon based on type
   */
  static getFileIcon(mimetype: string): string {
    const category = this.getFileTypeCategory(mimetype);
    
    const icons = {
      image: '🖼️',
      video: '🎥',
      audio: '🎵',
      pdf: '📄',
      document: '📝',
      spreadsheet: '📊',
      presentation: '📽️',
      text: '📄',
      other: '📁'
    };

    return icons[category] || '📁';
  }
}
