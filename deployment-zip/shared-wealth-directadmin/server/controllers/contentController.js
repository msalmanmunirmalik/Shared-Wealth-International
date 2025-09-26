import { ContentService } from '../services/contentService.js';
export class ContentController {
    static async createFundingOpportunity(req, res) {
        try {
            const { title, category, description, amount, deadline, eligibility, url, status } = req.body;
            if (!title || !category || !description) {
                res.status(400).json({
                    success: false,
                    message: 'Title, category, and description are required'
                });
                return;
            }
            const result = await ContentService.createFundingOpportunity({
                title,
                category,
                description,
                amount: amount || 'Not specified',
                deadline: deadline || 'No deadline',
                eligibility: eligibility || 'See details',
                url: url || '',
                status: status || 'active'
            });
            if (result.success) {
                res.status(201).json(result.data);
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message
                });
            }
        }
        catch (error) {
            console.error('Create funding opportunity controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async updateFundingOpportunity(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            if (!id || typeof id !== 'string') {
                res.status(400).json({
                    success: false,
                    message: 'Invalid funding opportunity ID'
                });
                return;
            }
            const result = await ContentService.updateFundingOpportunity(id, updateData);
            if (result.success) {
                res.json(result.data);
            }
            else if (result.message === 'Funding opportunity not found') {
                res.status(404).json({
                    success: false,
                    message: result.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message
                });
            }
        }
        catch (error) {
            console.error('Update funding opportunity controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async deleteFundingOpportunity(req, res) {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                res.status(400).json({
                    success: false,
                    message: 'Invalid funding opportunity ID'
                });
                return;
            }
            const result = await ContentService.deleteFundingOpportunity(id);
            if (result.success) {
                res.json({
                    success: true,
                    message: result.data?.message
                });
            }
            else if (result.message === 'Funding opportunity not found') {
                res.status(404).json({
                    success: false,
                    message: result.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message
                });
            }
        }
        catch (error) {
            console.error('Delete funding opportunity controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getFundingOpportunities(req, res) {
        try {
            const { page, limit } = req.query;
            let pagination;
            if (page && limit) {
                pagination = {
                    page: parseInt(page),
                    limit: parseInt(limit)
                };
            }
            const result = await ContentService.getFundingOpportunities(pagination);
            if (result.success) {
                res.json(result.data);
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message
                });
            }
        }
        catch (error) {
            console.error('Get funding opportunities controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async createNewsArticle(req, res) {
        try {
            const { title, content, category, author, status } = req.body;
            if (!title || !content || !category) {
                res.status(400).json({
                    success: false,
                    message: 'Title, content, and category are required'
                });
                return;
            }
            const result = await ContentService.createNewsArticle({
                title,
                content,
                category,
                author: author || 'Admin',
                status: status || 'draft'
            });
            if (result.success) {
                res.status(201).json(result.data);
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message
                });
            }
        }
        catch (error) {
            console.error('Create news article controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async updateNewsArticle(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            if (!id || typeof id !== 'string') {
                res.status(400).json({
                    success: false,
                    message: 'Invalid news article ID'
                });
                return;
            }
            const result = await ContentService.updateNewsArticle(id, updateData);
            if (result.success) {
                res.json(result.data);
            }
            else if (result.message === 'News article not found') {
                res.status(404).json({
                    success: false,
                    message: result.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message
                });
            }
        }
        catch (error) {
            console.error('Update news article controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async deleteNewsArticle(req, res) {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                res.status(400).json({
                    success: false,
                    message: 'Invalid news article ID'
                });
                return;
            }
            const result = await ContentService.deleteNewsArticle(id);
            if (result.success) {
                res.json({
                    success: true,
                    message: result.data?.message
                });
            }
            else if (result.message === 'News article not found') {
                res.status(404).json({
                    success: false,
                    message: result.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message
                });
            }
        }
        catch (error) {
            console.error('Delete news article controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getNewsArticles(req, res) {
        try {
            const { page, limit } = req.query;
            let pagination;
            if (page && limit) {
                pagination = {
                    page: parseInt(page),
                    limit: parseInt(limit)
                };
            }
            const result = await ContentService.getNewsArticles(pagination);
            if (result.success) {
                res.json(result.data);
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message
                });
            }
        }
        catch (error) {
            console.error('Get news articles controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async createEvent(req, res) {
        try {
            const { title, description, start_date, end_date, location, max_participants, status } = req.body;
            if (!title || !description || !start_date || !end_date) {
                res.status(400).json({
                    success: false,
                    message: 'Title, description, start date, and end date are required'
                });
                return;
            }
            const result = await ContentService.createEvent({
                title,
                description,
                start_date,
                end_date,
                location: location || 'Online',
                max_participants: max_participants || 100,
                status: status || 'upcoming'
            });
            if (result.success) {
                res.status(201).json(result.data);
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message
                });
            }
        }
        catch (error) {
            console.error('Create event controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async updateEvent(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            if (!id || typeof id !== 'string') {
                res.status(400).json({
                    success: false,
                    message: 'Invalid event ID'
                });
                return;
            }
            const result = await ContentService.updateEvent(id, updateData);
            if (result.success) {
                res.json(result.data);
            }
            else if (result.message === 'Event not found') {
                res.status(404).json({
                    success: false,
                    message: result.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message
                });
            }
        }
        catch (error) {
            console.error('Update event controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async deleteEvent(req, res) {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                res.status(400).json({
                    success: false,
                    message: 'Invalid event ID'
                });
                return;
            }
            const result = await ContentService.deleteEvent(id);
            if (result.success) {
                res.json({
                    success: true,
                    message: result.data?.message
                });
            }
            else if (result.message === 'Event not found') {
                res.status(404).json({
                    success: false,
                    message: result.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message
                });
            }
        }
        catch (error) {
            console.error('Delete event controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getEvents(req, res) {
        try {
            const { page, limit } = req.query;
            let pagination;
            if (page && limit) {
                pagination = {
                    page: parseInt(page),
                    limit: parseInt(limit)
                };
            }
            const result = await ContentService.getEvents(pagination);
            if (result.success) {
                res.json(result.data);
            }
            else {
                res.status(500).json({
                    success: false,
                    message: result.message
                });
            }
        }
        catch (error) {
            console.error('Get events controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}
//# sourceMappingURL=contentController.js.map