import { FundingService } from '../services/fundingService.js';
export class FundingController {
    static async createFundingApplication(req, res) {
        try {
            const { opportunity_id, applicant_id, company_id, application_data } = req.body;
            if (!opportunity_id || !applicant_id || !company_id || !application_data) {
                res.status(400).json({
                    success: false,
                    message: 'Opportunity ID, applicant ID, company ID, and application data are required'
                });
                return;
            }
            const result = await FundingService.createFundingApplication({
                opportunity_id,
                applicant_id,
                company_id,
                application_data,
                status: 'submitted',
                submitted_at: new Date().toISOString()
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
            console.error('Create funding application controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async updateFundingApplication(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            if (!id || typeof id !== 'string') {
                res.status(400).json({
                    success: false,
                    message: 'Invalid funding application ID'
                });
                return;
            }
            const result = await FundingService.updateFundingApplication(id, updateData);
            if (result.success) {
                res.json(result.data);
            }
            else if (result.message === 'Funding application not found') {
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
            console.error('Update funding application controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getFundingApplications(req, res) {
        try {
            const { page, limit, status, opportunity_id, applicant_id } = req.query;
            let pagination;
            if (page && limit) {
                pagination = {
                    page: parseInt(page),
                    limit: parseInt(limit)
                };
            }
            const filters = {};
            if (status)
                filters.status = status;
            if (opportunity_id)
                filters.opportunity_id = opportunity_id;
            if (applicant_id)
                filters.applicant_id = applicant_id;
            const result = await FundingService.getFundingApplications(pagination, filters);
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
            console.error('Get funding applications controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getFundingApplicationById(req, res) {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                res.status(400).json({
                    success: false,
                    message: 'Invalid funding application ID'
                });
                return;
            }
            const result = await FundingService.getFundingApplicationById(id);
            if (result.success) {
                res.json(result.data);
            }
            else if (result.message === 'Funding application not found') {
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
            console.error('Get funding application by ID controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async approveFundingApplication(req, res) {
        try {
            const { id } = req.params;
            const { funding_amount, review_notes } = req.body;
            if (!id || typeof id !== 'string') {
                res.status(400).json({
                    success: false,
                    message: 'Invalid funding application ID'
                });
                return;
            }
            if (!funding_amount || funding_amount <= 0) {
                res.status(400).json({
                    success: false,
                    message: 'Valid funding amount is required'
                });
                return;
            }
            const result = await FundingService.approveFundingApplication(id, funding_amount, review_notes);
            if (result.success) {
                res.json(result.data);
            }
            else if (result.message === 'Funding application not found') {
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
            console.error('Approve funding application controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async rejectFundingApplication(req, res) {
        try {
            const { id } = req.params;
            const { rejection_reason } = req.body;
            if (!id || typeof id !== 'string') {
                res.status(400).json({
                    success: false,
                    message: 'Invalid funding application ID'
                });
                return;
            }
            if (!rejection_reason) {
                res.status(400).json({
                    success: false,
                    message: 'Rejection reason is required'
                });
                return;
            }
            const result = await FundingService.rejectFundingApplication(id, rejection_reason);
            if (result.success) {
                res.json(result.data);
            }
            else if (result.message === 'Funding application not found') {
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
            console.error('Reject funding application controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async deleteFundingApplication(req, res) {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                res.status(400).json({
                    success: false,
                    message: 'Invalid funding application ID'
                });
                return;
            }
            const result = await FundingService.deleteFundingApplication(id);
            if (result.success) {
                res.json({
                    success: true,
                    message: result.data?.message
                });
            }
            else if (result.message === 'Funding application not found') {
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
            console.error('Delete funding application controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getFundingOpportunitiesWithStats(req, res) {
        try {
            const { page, limit } = req.query;
            let pagination;
            if (page && limit) {
                pagination = {
                    page: parseInt(page),
                    limit: parseInt(limit)
                };
            }
            const result = await FundingService.getFundingOpportunitiesWithStats(pagination);
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
            console.error('Get funding opportunities with stats controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getFundingAnalytics(req, res) {
        try {
            const result = await FundingService.getFundingAnalytics();
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
            console.error('Get funding analytics controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}
//# sourceMappingURL=fundingController.js.map