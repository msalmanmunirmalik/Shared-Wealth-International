import { CompanyService } from '../services/companyService.js';
export class CompanyController {
    static async getCompanies(req, res) {
        try {
            const { page, limit } = req.query;
            let pagination;
            if (page && limit) {
                pagination = {
                    page: parseInt(page),
                    limit: parseInt(limit)
                };
            }
            const result = await CompanyService.getCompanies(pagination);
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
            console.error('Get companies controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getCompanyById(req, res) {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                res.status(400).json({
                    success: false,
                    message: 'Invalid company ID'
                });
                return;
            }
            const result = await CompanyService.getCompanyById(id);
            if (result.success) {
                res.json({
                    success: true,
                    data: result.data
                });
            }
            else if (result.message === 'Company not found') {
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
            console.error('Get company controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async createCompany(req, res) {
        try {
            const companyData = req.body;
            const userId = req.user?.id;
            if (!companyData.name || typeof companyData.name !== 'string') {
                res.status(400).json({
                    success: false,
                    message: 'Company name is required'
                });
                return;
            }
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User authentication required'
                });
                return;
            }
            const result = await CompanyService.createCompany(companyData, userId);
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
            console.error('Create company controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getUserCompanies(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User authentication required'
                });
                return;
            }
            const result = await CompanyService.getUserCompanies(userId);
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
            console.error('Get user companies controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getUserApplications(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User authentication required'
                });
                return;
            }
            const result = await CompanyService.getUserApplications(userId);
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
            console.error('Get user applications controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async updateCompany(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            if (!id || typeof id !== 'string') {
                res.status(400).json({
                    success: false,
                    message: 'Invalid company ID'
                });
                return;
            }
            const result = await CompanyService.updateCompany(id, updateData);
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
            console.error('Update company controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async deleteCompany(req, res) {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                res.status(400).json({
                    success: false,
                    message: 'Invalid company ID'
                });
                return;
            }
            const result = await CompanyService.deleteCompany(id);
            if (result.success) {
                res.json({
                    success: true,
                    message: result.data?.message
                });
            }
            else if (result.message === 'Company not found') {
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
            console.error('Delete company controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getCompaniesByStatus(req, res) {
        try {
            const { status } = req.params;
            if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid status. Must be pending, approved, or rejected'
                });
                return;
            }
            const result = await CompanyService.getCompaniesByStatus(status);
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
            console.error('Get companies by status controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async searchCompanies(req, res) {
        try {
            const { q, category } = req.query;
            if (!q || typeof q !== 'string') {
                res.status(400).json({
                    success: false,
                    message: 'Search query is required'
                });
                return;
            }
            const result = await CompanyService.searchCompanies(q, category);
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
            console.error('Search companies controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getCompanyStats(req, res) {
        try {
            const result = await CompanyService.getCompanyStats();
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
            console.error('Get company stats controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}
//# sourceMappingURL=companyController.js.map