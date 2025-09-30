import { UnifiedFileService } from '../services/unifiedFileService.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
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
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|mp4|mp3|wav/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        else {
            cb(new Error('Invalid file type. Only images, documents, and media files are allowed.'));
        }
    }
});
export class UnifiedFileController {
    static async uploadFile(req, res) {
        try {
            const userId = req.user?.id;
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
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message || 'Failed to upload file'
                });
            }
        }
        catch (error) {
            console.error('Upload file error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async uploadMultipleFiles(req, res) {
        try {
            const userId = req.user?.id;
            const { context, contextId, description, tags } = req.body;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
                return;
            }
            if (!req.files || req.files.length === 0) {
                res.status(400).json({
                    success: false,
                    message: 'No files uploaded'
                });
                return;
            }
            const files = req.files;
            const uploadedFiles = [];
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
        }
        catch (error) {
            console.error('Upload multiple files error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getFile(req, res) {
        try {
            const { fileId } = req.params;
            const userId = req.user?.id;
            const result = await UnifiedFileService.getFile(fileId, userId);
            if (result.success) {
                res.json({
                    success: true,
                    data: result.data
                });
            }
            else {
                res.status(404).json({
                    success: false,
                    message: result.message || 'File not found'
                });
            }
        }
        catch (error) {
            console.error('Get file error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async downloadFile(req, res) {
        try {
            const { fileId } = req.params;
            const userId = req.user?.id;
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
            await UnifiedFileService.incrementDownloadCount(fileId);
            res.download(filePath, file.originalName);
        }
        catch (error) {
            console.error('Download file error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getFilesByContext(req, res) {
        try {
            const { context, contextId } = req.params;
            const { limit = '20', offset = '0', type, search } = req.query;
            const userId = req.user?.id;
            const result = await UnifiedFileService.getFilesByContext(context, contextId, {
                limit: parseInt(limit),
                offset: parseInt(offset),
                type: type,
                search: search
            }, userId);
            if (result.success) {
                res.json({
                    success: true,
                    data: result.data,
                    pagination: {
                        limit: parseInt(limit),
                        offset: parseInt(offset),
                        total: result.total || 0
                    }
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message || 'Failed to get files'
                });
            }
        }
        catch (error) {
            console.error('Get files by context error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getUserFiles(req, res) {
        try {
            const { userId } = req.params;
            const { limit = '20', offset = '0', type, search } = req.query;
            const authUserId = req.user?.id;
            if (authUserId !== userId && req.user?.role !== 'admin') {
                res.status(403).json({
                    success: false,
                    message: 'Unauthorized to view these files'
                });
                return;
            }
            const result = await UnifiedFileService.getUserFiles(userId, {
                limit: parseInt(limit),
                offset: parseInt(offset),
                type: type,
                search: search
            });
            if (result.success) {
                res.json({
                    success: true,
                    data: result.data,
                    pagination: {
                        limit: parseInt(limit),
                        offset: parseInt(offset),
                        total: result.total || 0
                    }
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message || 'Failed to get user files'
                });
            }
        }
        catch (error) {
            console.error('Get user files error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async updateFile(req, res) {
        try {
            const { fileId } = req.params;
            const { description, tags, isPublic } = req.body;
            const userId = req.user?.id;
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
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message || 'Failed to update file'
                });
            }
        }
        catch (error) {
            console.error('Update file error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async deleteFile(req, res) {
        try {
            const { fileId } = req.params;
            const userId = req.user?.id;
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
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message || 'Failed to delete file'
                });
            }
        }
        catch (error) {
            console.error('Delete file error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async shareFile(req, res) {
        try {
            const { fileId } = req.params;
            const { shareType, recipients, message, expiresAt } = req.body;
            const userId = req.user?.id;
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
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message || 'Failed to share file'
                });
            }
        }
        catch (error) {
            console.error('Share file error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getFileShares(req, res) {
        try {
            const { fileId } = req.params;
            const userId = req.user?.id;
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
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message || 'Failed to get file shares'
                });
            }
        }
        catch (error) {
            console.error('Get file shares error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getFileAnalytics(req, res) {
        try {
            const { fileId } = req.params;
            const userId = req.user?.id;
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
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message || 'Failed to get file analytics'
                });
            }
        }
        catch (error) {
            console.error('Get file analytics error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getStorageStats(req, res) {
        try {
            const userId = req.user?.id;
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
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message || 'Failed to get storage stats'
                });
            }
        }
        catch (error) {
            console.error('Get storage stats error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}
export { upload };
//# sourceMappingURL=unifiedFileController.js.map