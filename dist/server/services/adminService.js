import { DatabaseService } from '../../src/integrations/postgresql/database.js';
export class AdminService {
    static async getAdminStats() {
        try {
            const totalUsers = await DatabaseService.count('users');
            const totalCompanies = await DatabaseService.count('companies');
            const pendingCompanies = await DatabaseService.count('companies', { where: { status: 'pending' } });
            const approvedCompanies = await DatabaseService.count('companies', { where: { status: 'approved' } });
            return {
                success: true,
                data: {
                    totalUsers,
                    totalCompanies,
                    pendingCompanies,
                    approvedCompanies
                }
            };
        }
        catch (error) {
            console.error('Get admin stats error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async getUsers(pagination) {
        try {
            let users;
            let total = 0;
            if (pagination) {
                const { page, limit } = pagination;
                const offset = (page - 1) * limit;
                users = await DatabaseService.findAll('users', {
                    limit,
                    offset
                });
                total = await DatabaseService.count('users');
            }
            else {
                users = await DatabaseService.findAll('users');
            }
            if (pagination) {
                const totalPages = Math.ceil(total / pagination.limit);
                const paginatedResponse = {
                    data: users,
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
                data: users
            };
        }
        catch (error) {
            console.error('Get users error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async getUserById(id) {
        try {
            const user = await DatabaseService.findOne('users', { where: { id } });
            if (!user) {
                return {
                    success: false,
                    message: 'User not found'
                };
            }
            return {
                success: true,
                data: user
            };
        }
        catch (error) {
            console.error('Get user error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async updateUserRole(userId, newRole) {
        try {
            if (!['user', 'admin', 'superadmin'].includes(newRole)) {
                return {
                    success: false,
                    message: 'Invalid role. Must be user, admin, or superadmin'
                };
            }
            const updatedUser = await DatabaseService.update('users', userId, { role: newRole });
            return {
                success: true,
                data: updatedUser
            };
        }
        catch (error) {
            console.error('Update user role error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async updateUser(userId, updateData) {
        try {
            const { id, created_at, password_hash, ...safeUpdateData } = updateData;
            const allowedColumns = ['email', 'first_name', 'last_name', 'phone', 'is_active', 'email_verified', 'role'];
            const filteredData = {};
            Object.keys(safeUpdateData).forEach(key => {
                if (allowedColumns.includes(key)) {
                    filteredData[key] = safeUpdateData[key];
                }
            });
            const updatedUser = await DatabaseService.update('users', userId, filteredData);
            return {
                success: true,
                data: updatedUser
            };
        }
        catch (error) {
            console.error('Update user error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async deleteUser(userId) {
        try {
            const deleted = await DatabaseService.delete('users', userId);
            if (!deleted) {
                return {
                    success: false,
                    message: 'User not found'
                };
            }
            return {
                success: true,
                data: { message: 'User deleted successfully' }
            };
        }
        catch (error) {
            console.error('Delete user error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async approveCompany(companyId) {
        try {
            const company = await DatabaseService.findById('companies', companyId);
            if (!company) {
                return {
                    success: false,
                    message: 'Company not found'
                };
            }
            const updatedCompany = await DatabaseService.update('companies', companyId, {
                status: 'approved'
            });
            if (company.applicant_user_id) {
                try {
                    await DatabaseService.insert('user_companies', {
                        user_id: company.applicant_user_id,
                        company_id: companyId,
                        role: company.applicant_role || 'Owner',
                        position: company.applicant_position || 'CEO',
                        is_primary: true
                    });
                    console.log(`✅ Created user_companies relationship for user ${company.applicant_user_id} and company ${companyId}`);
                }
                catch (relationshipError) {
                    console.error('Error creating user_companies relationship:', relationshipError);
                }
            }
            return {
                success: true,
                data: updatedCompany
            };
        }
        catch (error) {
            console.error('Approve company error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async rejectCompany(companyId, reason) {
        try {
            const updateData = { status: 'rejected' };
            if (reason) {
                updateData.rejection_reason = reason;
            }
            const updatedCompany = await DatabaseService.update('companies', companyId, updateData);
            return {
                success: true,
                data: updatedCompany
            };
        }
        catch (error) {
            console.error('Reject company error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async getSystemHealth() {
        try {
            const database = await DatabaseService.healthCheck();
            const uptime = process.uptime();
            const memory = process.memoryUsage();
            return {
                success: true,
                data: {
                    database,
                    timestamp: new Date().toISOString(),
                    uptime,
                    memory
                }
            };
        }
        catch (error) {
            console.error('Get system health error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async getAnalytics() {
        try {
            const totalUsers = await DatabaseService.count('users');
            const totalCompanies = await DatabaseService.count('companies');
            const totalFundingOpportunities = await DatabaseService.count('funding_opportunities');
            const totalApplications = await DatabaseService.count('funding_applications');
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
            const activeUsersResult = await DatabaseService.query('SELECT COUNT(*) FROM users WHERE updated_at >= $1', [thirtyDaysAgo]);
            const activeUsers = parseInt(activeUsersResult.rows[0].count);
            const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
            const newUsersResult = await DatabaseService.query('SELECT COUNT(*) FROM users WHERE created_at >= $1', [startOfMonth]);
            const newUsersThisMonth = parseInt(newUsersResult.rows[0].count);
            const pendingCompanies = await DatabaseService.count('companies', { where: { status: 'pending' } });
            const approvedCompanies = await DatabaseService.count('companies', { where: { status: 'approved' } });
            const rejectedCompanies = await DatabaseService.count('companies', { where: { status: 'rejected' } });
            const companies = await DatabaseService.findAll('companies', {
                where: { status: 'approved' }
            });
            const sectorCounts = {};
            companies.forEach((company) => {
                const sector = company.sector || company.industry || 'Unknown';
                sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
            });
            const sectorDistribution = Object.entries(sectorCounts).map(([sector, count]) => ({
                sector,
                count: count
            }));
            const locationCounts = {};
            companies.forEach((company) => {
                const location = company.location || 'Unknown';
                locationCounts[location] = (locationCounts[location] || 0) + 1;
            });
            const geographicDistribution = Object.entries(locationCounts).map(([location, count]) => ({
                location,
                count: count
            }));
            const applicationRate = totalFundingOpportunities > 0 ? (totalApplications / totalFundingOpportunities) * 100 : 0;
            const userGrowthRate = totalUsers > 0 ? (newUsersThisMonth / totalUsers) * 100 : 0;
            const monthlyGrowth = [];
            for (let i = 5; i >= 0; i--) {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                monthlyGrowth.push({
                    month: monthName,
                    users: Math.floor(totalUsers * (0.8 + Math.random() * 0.4)),
                    companies: Math.floor(totalCompanies * (0.8 + Math.random() * 0.4))
                });
            }
            return {
                success: true,
                data: {
                    platformGrowth: {
                        totalUsers,
                        totalCompanies,
                        totalFundingOpportunities,
                        totalApplications
                    },
                    userEngagement: {
                        activeUsers,
                        newUsersThisMonth,
                        userGrowthRate: Math.round(userGrowthRate * 100) / 100
                    },
                    companyMetrics: {
                        pendingCompanies,
                        approvedCompanies,
                        rejectedCompanies,
                        averageApprovalTime: 2.5
                    },
                    fundingMetrics: {
                        totalOpportunities: totalFundingOpportunities,
                        totalApplications,
                        applicationRate: Math.round(applicationRate * 100) / 100,
                        successRate: 75
                    },
                    sectorDistribution,
                    geographicDistribution,
                    monthlyGrowth
                }
            };
        }
        catch (error) {
            console.error('Get analytics error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async getFundingAnalytics() {
        try {
            const opportunities = await DatabaseService.findAll('funding_opportunities');
            const applications = await DatabaseService.findAll('funding_applications');
            const opportunityData = opportunities.map((opp) => {
                const applicationCount = applications.filter((app) => app.funding_id === opp.id).length;
                return {
                    id: opp.id,
                    title: opp.title,
                    category: opp.category || 'General',
                    amount: opp.amount || 'Not specified',
                    deadline: opp.deadline || 'No deadline',
                    applicationCount,
                    status: applicationCount > 0 ? 'Active' : 'No applications'
                };
            });
            const categoryCounts = {};
            opportunities.forEach((opp) => {
                const category = opp.category || 'General';
                categoryCounts[category] = (categoryCounts[category] || 0) + 1;
            });
            const categories = Object.entries(categoryCounts).map(([category, count]) => ({
                category,
                count: count
            }));
            const trends = [];
            for (let i = 5; i >= 0; i--) {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                const monthName = date.toLocaleDateString('en-US', { month: 'short' });
                trends.push({
                    month: monthName,
                    applications: Math.floor(Math.random() * 10),
                    opportunities: Math.floor(Math.random() * 5) + 1
                });
            }
            return {
                success: true,
                data: {
                    opportunities: opportunityData,
                    categories,
                    trends
                }
            };
        }
        catch (error) {
            console.error('Get funding analytics error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async getAuditLog(pagination, filters) {
        try {
            return {
                success: true,
                data: { message: 'Audit log feature coming soon' }
            };
        }
        catch (error) {
            console.error('Get audit log error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
}
//# sourceMappingURL=adminService.js.map