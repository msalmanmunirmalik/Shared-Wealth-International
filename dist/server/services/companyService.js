import { DatabaseService } from '../../src/integrations/postgresql/database.js';
export class CompanyService {
    static async getCompanies(pagination) {
        try {
            let companies;
            let total = 0;
            if (pagination) {
                const { page, limit } = pagination;
                const offset = (page - 1) * limit;
                companies = await DatabaseService.findAll('companies', {
                    where: { status: 'approved' },
                    limit,
                    offset
                });
                total = await DatabaseService.count('companies', { where: { status: 'approved' } });
            }
            else {
                companies = await DatabaseService.findAll('companies', {
                    where: { status: 'approved' }
                });
                total = companies.length;
            }
            if (pagination) {
                const totalPages = Math.ceil(total / pagination.limit);
                const paginatedResponse = {
                    data: companies,
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
                data: companies
            };
        }
        catch (error) {
            console.error('Get companies error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async getCompanyById(id) {
        try {
            const company = await DatabaseService.findById('companies', id);
            if (!company) {
                return {
                    success: false,
                    message: 'Company not found'
                };
            }
            return {
                success: true,
                data: company
            };
        }
        catch (error) {
            console.error('Get company error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async createCompany(companyData, userId) {
        try {
            const newCompany = await DatabaseService.insert('companies', {
                name: companyData.name,
                description: companyData.description,
                industry: companyData.industry,
                sector: companyData.industry,
                size: companyData.size,
                location: companyData.location,
                website: companyData.website,
                status: 'pending',
                is_active: true,
                is_verified: false,
                applicant_user_id: userId
            });
            return {
                success: true,
                data: newCompany
            };
        }
        catch (error) {
            console.error('Create company error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async updateCompany(id, updateData) {
        try {
            const { id: _, created_at, ...safeUpdateData } = updateData;
            const mappedData = { ...safeUpdateData };
            if (mappedData.industry) {
                mappedData.sector = mappedData.industry;
                delete mappedData.industry;
            }
            const allowedColumns = ['name', 'description', 'sector', 'location', 'website', 'logo_url', 'is_active', 'is_verified'];
            const filteredData = {};
            Object.keys(mappedData).forEach(key => {
                if (allowedColumns.includes(key)) {
                    filteredData[key] = mappedData[key];
                }
            });
            const updatedCompany = await DatabaseService.update('companies', id, filteredData);
            return {
                success: true,
                data: updatedCompany
            };
        }
        catch (error) {
            console.error('Update company error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async getUserCompanies(userId) {
        try {
            console.log('🔍 CompanyService.getUserCompanies - User ID:', userId);
            const query = `
        SELECT c.*, uc.position as role
        FROM companies c
        INNER JOIN user_companies uc ON c.id = uc.company_id
        WHERE uc.user_id = $1
        ORDER BY c.created_at DESC
      `;
            console.log('🔍 CompanyService.getUserCompanies - Executing query:', query);
            console.log('🔍 CompanyService.getUserCompanies - Query params:', [userId]);
            const result = await DatabaseService.query(query, [userId]);
            console.log('🔍 CompanyService.getUserCompanies - Query result:', result.rows.length, 'companies');
            result.rows.forEach((company, index) => {
                console.log(`  ${index + 1}. ${company.name} (role: ${company.role})`);
            });
            return {
                success: true,
                data: result.rows
            };
        }
        catch (error) {
            console.error('Get user companies error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async getUserCreatedCompanies(userId) {
        try {
            const query = `
        SELECT c.*
        FROM companies c
        WHERE c.applicant_user_id = $1
        ORDER BY c.created_at DESC
      `;
            const result = await DatabaseService.query(query, [userId]);
            return {
                success: true,
                data: result.rows || []
            };
        }
        catch (error) {
            console.error('Get user created companies error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async getUserApplications(userId) {
        try {
            return {
                success: true,
                data: []
            };
        }
        catch (error) {
            console.error('Get user applications error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async deleteCompany(id) {
        try {
            const deleted = await DatabaseService.delete('companies', id);
            if (!deleted) {
                return {
                    success: false,
                    message: 'Company not found'
                };
            }
            return {
                success: true,
                data: { message: 'Company deleted successfully' }
            };
        }
        catch (error) {
            console.error('Delete company error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async getCompaniesByStatus(isActive) {
        try {
            const companies = await DatabaseService.findAll('companies', {
                where: { status: 'approved' }
            });
            return {
                success: true,
                data: companies
            };
        }
        catch (error) {
            console.error('Get companies by status error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async searchCompanies(query, category) {
        try {
            let companies;
            if (category) {
                companies = await DatabaseService.findAll('companies', {
                    where: { status: 'approved', industry: category }
                });
            }
            else {
                companies = await DatabaseService.findAll('companies', {
                    where: { status: 'approved' }
                });
            }
            const filteredCompanies = companies.filter(company => company.name.toLowerCase().includes(query.toLowerCase()) ||
                company.description.toLowerCase().includes(query.toLowerCase()) ||
                (company.industry && company.industry.toLowerCase().includes(query.toLowerCase())));
            return {
                success: true,
                data: filteredCompanies
            };
        }
        catch (error) {
            console.error('Search companies error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async getCompanyStats() {
        try {
            const total = await DatabaseService.count('companies');
            const active = await DatabaseService.count('companies', { where: { is_active: true } });
            const inactive = await DatabaseService.count('companies', { where: { is_active: false } });
            const verified = await DatabaseService.count('companies', { where: { is_verified: true } });
            const unverified = await DatabaseService.count('companies', { where: { is_verified: false } });
            return {
                success: true,
                data: {
                    total,
                    active,
                    inactive,
                    verified,
                    unverified
                }
            };
        }
        catch (error) {
            console.error('Get company stats error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
}
//# sourceMappingURL=companyService.js.map