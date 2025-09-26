import { DatabaseService } from '../../src/integrations/postgresql/database.js';
export class UserProfileController {
    static async getUserProfile(req, res) {
        try {
            if (!req.user?.id) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }
            const user = await DatabaseService.findOne('users', {
                where: { id: req.user.id }
            });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            const { password_hash, ...userProfile } = user;
            res.json({
                success: true,
                data: userProfile
            });
        }
        catch (error) {
            console.error('Get user profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async updateUserProfile(req, res) {
        try {
            if (!req.user?.id) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }
            const { first_name, last_name, bio, company_name, position, phone, location, website, linkedin, twitter, role, avatar_url } = req.body;
            const updatedUser = await DatabaseService.update('users', req.user.id, {
                first_name,
                last_name,
                bio,
                company_name,
                position,
                phone,
                location,
                website,
                linkedin,
                twitter,
                role,
                avatar_url,
                updated_at: new Date()
            });
            if (!updatedUser) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            const { password_hash, ...userProfile } = updatedUser;
            res.json({
                success: true,
                data: userProfile,
                message: 'Profile updated successfully'
            });
        }
        catch (error) {
            console.error('Update user profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getUserCompanies(req, res) {
        try {
            if (!req.user?.id) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }
            const userCompanies = await DatabaseService.query(`
        SELECT 
          c.id,
          c.name,
          c.logo_url,
          c.description,
          c.sector,
          c.website,
          c.location,
          c.status as approved,
          c.created_at,
          uc.role,
          uc.position
        FROM user_companies uc
        JOIN companies c ON uc.company_id = c.id
        WHERE uc.user_id = $1 AND uc.status = 'active'
        ORDER BY c.created_at DESC
      `, [req.user.id]);
            res.json({
                success: true,
                data: userCompanies.rows
            });
        }
        catch (error) {
            console.error('Get user companies error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getTeamMembers(req, res) {
        try {
            const { role } = req.query;
            let query = `
        SELECT 
          id,
          email,
          first_name,
          last_name,
          bio,
          avatar_url,
          position,
          company_name,
          location,
          website,
          linkedin,
          twitter,
          role,
          created_at
        FROM users
        WHERE is_active = true
      `;
            const params = [];
            if (role) {
                query += ` AND role = $1`;
                params.push(role);
            }
            query += ` ORDER BY created_at ASC`;
            const result = await DatabaseService.query(query, params);
            res.json({
                success: true,
                data: result.rows
            });
        }
        catch (error) {
            console.error('Get team members error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}
//# sourceMappingURL=userProfileController.js.map