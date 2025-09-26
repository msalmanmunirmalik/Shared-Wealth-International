import { DatabaseService } from '../../src/integrations/postgresql/database.js';
export class ContentService {
    static async createFundingOpportunity(data) {
        try {
            const opportunity = await DatabaseService.insert('funding_opportunities', {
                title: data.title,
                category: data.category,
                description: data.description,
                amount: data.amount,
                deadline: data.deadline,
                eligibility: data.eligibility,
                url: data.url,
                status: data.status || 'active'
            });
            return {
                success: true,
                data: opportunity
            };
        }
        catch (error) {
            console.error('Create funding opportunity error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async updateFundingOpportunity(id, data) {
        try {
            const updated = await DatabaseService.update('funding_opportunities', id, data);
            if (!updated) {
                return {
                    success: false,
                    message: 'Funding opportunity not found'
                };
            }
            return {
                success: true,
                data: updated
            };
        }
        catch (error) {
            console.error('Update funding opportunity error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async deleteFundingOpportunity(id) {
        try {
            const deleted = await DatabaseService.delete('funding_opportunities', id);
            if (!deleted) {
                return {
                    success: false,
                    message: 'Funding opportunity not found'
                };
            }
            return {
                success: true,
                data: { message: 'Funding opportunity deleted successfully' }
            };
        }
        catch (error) {
            console.error('Delete funding opportunity error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async getFundingOpportunities(pagination) {
        try {
            let opportunities;
            let total = 0;
            if (pagination) {
                const { page, limit } = pagination;
                const offset = (page - 1) * limit;
                opportunities = await DatabaseService.findAll('funding_opportunities', {
                    limit,
                    offset
                });
                total = await DatabaseService.count('funding_opportunities');
            }
            else {
                opportunities = await DatabaseService.findAll('funding_opportunities');
            }
            if (pagination) {
                const totalPages = Math.ceil(total / pagination.limit);
                const paginatedResponse = {
                    data: opportunities,
                    pagination: {
                        page: pagination.page,
                        limit: pagination.limit,
                        total,
                        totalPages
                    }
                };
                return {
                    success: true,
                    data: paginatedResponse
                };
            }
            return {
                success: true,
                data: opportunities
            };
        }
        catch (error) {
            console.error('Get funding opportunities error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async createNewsArticle(data) {
        try {
            const article = await DatabaseService.insert('news_articles', {
                title: data.title,
                content: data.content,
                category: data.category,
                author: data.author,
                status: data.status || 'draft',
                published_at: data.status === 'published' ? new Date().toISOString() : null
            });
            return {
                success: true,
                data: article
            };
        }
        catch (error) {
            console.error('Create news article error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async updateNewsArticle(id, data) {
        try {
            if (data.status === 'published' && !data.published_at) {
                data.published_at = new Date().toISOString();
            }
            const updated = await DatabaseService.update('news_articles', id, data);
            if (!updated) {
                return {
                    success: false,
                    message: 'News article not found'
                };
            }
            return {
                success: true,
                data: updated
            };
        }
        catch (error) {
            console.error('Update news article error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async deleteNewsArticle(id) {
        try {
            const deleted = await DatabaseService.delete('news_articles', id);
            if (!deleted) {
                return {
                    success: false,
                    message: 'News article not found'
                };
            }
            return {
                success: true,
                data: { message: 'News article deleted successfully' }
            };
        }
        catch (error) {
            console.error('Delete news article error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async getNewsArticles(pagination) {
        try {
            let articles;
            let total = 0;
            if (pagination) {
                const { page, limit } = pagination;
                const offset = (page - 1) * limit;
                articles = await DatabaseService.findAll('news_articles', {
                    limit,
                    offset
                });
                total = await DatabaseService.count('news_articles');
            }
            else {
                articles = await DatabaseService.findAll('news_articles');
            }
            if (pagination) {
                const totalPages = Math.ceil(total / pagination.limit);
                const paginatedResponse = {
                    data: articles,
                    pagination: {
                        page: pagination.page,
                        limit: pagination.limit,
                        total,
                        totalPages
                    }
                };
                return {
                    success: true,
                    data: paginatedResponse
                };
            }
            return {
                success: true,
                data: articles
            };
        }
        catch (error) {
            console.error('Get news articles error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async createEvent(data) {
        try {
            const event = await DatabaseService.insert('events', {
                title: data.title,
                description: data.description,
                start_date: data.start_date,
                end_date: data.end_date,
                location: data.location,
                max_participants: data.max_participants,
                status: data.status || 'upcoming'
            });
            return {
                success: true,
                data: event
            };
        }
        catch (error) {
            console.error('Create event error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async updateEvent(id, data) {
        try {
            const updated = await DatabaseService.update('events', id, data);
            if (!updated) {
                return {
                    success: false,
                    message: 'Event not found'
                };
            }
            return {
                success: true,
                data: updated
            };
        }
        catch (error) {
            console.error('Update event error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async deleteEvent(id) {
        try {
            const deleted = await DatabaseService.delete('events', id);
            if (!deleted) {
                return {
                    success: false,
                    message: 'Event not found'
                };
            }
            return {
                success: true,
                data: { message: 'Event deleted successfully' }
            };
        }
        catch (error) {
            console.error('Delete event error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async getEvents(pagination) {
        try {
            let events;
            let total = 0;
            if (pagination) {
                const { page, limit } = pagination;
                const offset = (page - 1) * limit;
                events = await DatabaseService.findAll('events', {
                    limit,
                    offset
                });
                total = await DatabaseService.count('events');
            }
            else {
                events = await DatabaseService.findAll('events');
            }
            if (pagination) {
                const totalPages = Math.ceil(total / pagination.limit);
                const paginatedResponse = {
                    data: events,
                    pagination: {
                        page: pagination.page,
                        limit: pagination.limit,
                        total,
                        totalPages
                    }
                };
                return {
                    success: true,
                    data: paginatedResponse
                };
            }
            return {
                success: true,
                data: events
            };
        }
        catch (error) {
            console.error('Get events error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
}
//# sourceMappingURL=contentService.js.map