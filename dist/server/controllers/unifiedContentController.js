import { UnifiedContentService } from '../services/unifiedContentService.js';
export class UnifiedContentController {
    static async getAllContent(req, res) {
        try {
            const { type, author_id, company_id, is_published, limit = '20', offset = '0', search, sort_by = 'published_at', sort_order = 'desc' } = req.query;
            const filters = {
                type: type,
                author_id: author_id,
                company_id: company_id,
                is_published: is_published === 'true' ? true : is_published === 'false' ? false : undefined,
                search: search,
                sort_by: sort_by,
                sort_order: sort_order,
                limit: parseInt(limit),
                offset: parseInt(offset)
            };
            const result = await UnifiedContentService.getAllContent(filters);
            if (result.success) {
                res.json({
                    success: true,
                    data: result.data,
                    pagination: {
                        limit: filters.limit,
                        offset: filters.offset,
                        total: result.total || 0,
                        has_more: result.has_more || false
                    }
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message || 'Failed to fetch content'
                });
            }
        }
        catch (error) {
            console.error('Get all content error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getContentById(req, res) {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                res.status(400).json({
                    success: false,
                    message: 'Invalid content ID'
                });
                return;
            }
            const result = await UnifiedContentService.getContentById(id);
            if (result.success) {
                res.json({
                    success: true,
                    data: result.data
                });
            }
            else if (result.message === 'Content not found') {
                res.status(404).json({
                    success: false,
                    message: result.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message || 'Failed to fetch content'
                });
            }
        }
        catch (error) {
            console.error('Get content by ID error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async createContent(req, res) {
        try {
            const contentData = req.body;
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
                return;
            }
            if (!contentData.title || !contentData.content) {
                res.status(400).json({
                    success: false,
                    message: 'Title and content are required'
                });
                return;
            }
            contentData.type = 'post';
            const result = await UnifiedContentService.createContent(userId, contentData);
            if (result.success) {
                res.status(201).json({
                    success: true,
                    data: result.data,
                    message: 'Content created successfully'
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message || 'Failed to create content'
                });
            }
        }
        catch (error) {
            console.error('Create content error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async updateContent(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const userId = req.user?.id;
            if (!id) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid content ID'
                });
                return;
            }
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
                return;
            }
            const result = await UnifiedContentService.updateContent(id, userId, updateData);
            if (result.success) {
                res.json({
                    success: true,
                    data: result.data,
                    message: 'Content updated successfully'
                });
            }
            else if (result.message === 'Content not found') {
                res.status(404).json({
                    success: false,
                    message: result.message
                });
            }
            else if (result.message === 'Permission denied') {
                res.status(403).json({
                    success: false,
                    message: result.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message || 'Failed to update content'
                });
            }
        }
        catch (error) {
            console.error('Update content error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async deleteContent(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user?.id;
            if (!id) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid content ID'
                });
                return;
            }
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
                return;
            }
            const result = await UnifiedContentService.deleteContent(id, userId);
            if (result.success) {
                res.json({
                    success: true,
                    message: 'Content deleted successfully'
                });
            }
            else if (result.message === 'Content not found') {
                res.status(404).json({
                    success: false,
                    message: result.message
                });
            }
            else if (result.message === 'Permission denied') {
                res.status(403).json({
                    success: false,
                    message: result.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message || 'Failed to delete content'
                });
            }
        }
        catch (error) {
            console.error('Delete content error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getContentByCompany(req, res) {
        try {
            const { companyId } = req.params;
            const { type, limit = '20', offset = '0' } = req.query;
            if (!companyId || typeof companyId !== 'string') {
                res.status(400).json({
                    success: false,
                    message: 'Invalid company ID'
                });
                return;
            }
            const filters = {
                company_id: companyId,
                type: type,
                limit: parseInt(limit),
                offset: parseInt(offset)
            };
            const result = await UnifiedContentService.getContentByCompany(filters);
            if (result.success) {
                res.json({
                    success: true,
                    data: result.data,
                    pagination: {
                        limit: filters.limit,
                        offset: filters.offset,
                        total: result.total || 0
                    }
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message || 'Failed to fetch company content'
                });
            }
        }
        catch (error) {
            console.error('Get content by company error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getContentByUser(req, res) {
        try {
            const { userId } = req.params;
            const { type, limit = '20', offset = '0' } = req.query;
            if (!userId || typeof userId !== 'string') {
                res.status(400).json({
                    success: false,
                    message: 'Invalid user ID'
                });
                return;
            }
            const filters = {
                author_id: userId,
                type: type,
                limit: parseInt(limit),
                offset: parseInt(offset)
            };
            const result = await UnifiedContentService.getContentByUser(filters);
            if (result.success) {
                res.json({
                    success: true,
                    data: result.data,
                    pagination: {
                        limit: filters.limit,
                        offset: filters.offset,
                        total: result.total || 0
                    }
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message || 'Failed to fetch user content'
                });
            }
        }
        catch (error) {
            console.error('Get content by user error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async togglePublishStatus(req, res) {
        try {
            const { id } = req.params;
            const { is_published } = req.body;
            const userId = req.user?.id;
            if (!id) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid content ID'
                });
                return;
            }
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
                return;
            }
            if (typeof is_published !== 'boolean') {
                res.status(400).json({
                    success: false,
                    message: 'is_published must be a boolean value'
                });
                return;
            }
            const result = await UnifiedContentService.togglePublishStatus(id, userId, is_published);
            if (result.success) {
                res.json({
                    success: true,
                    data: result.data,
                    message: `Content ${is_published ? 'published' : 'unpublished'} successfully`
                });
            }
            else if (result.message === 'Content not found') {
                res.status(404).json({
                    success: false,
                    message: result.message
                });
            }
            else if (result.message === 'Permission denied') {
                res.status(403).json({
                    success: false,
                    message: result.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message || 'Failed to update publish status'
                });
            }
        }
        catch (error) {
            console.error('Toggle publish status error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}
//# sourceMappingURL=unifiedContentController.js.map