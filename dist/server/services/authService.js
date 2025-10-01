import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { DatabaseService } from '../../src/integrations/postgresql/database.js';
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error('❌ CRITICAL: JWT_SECRET environment variable is not set!');
    process.exit(1);
}
export class AuthService {
    static async signIn(credentials) {
        try {
            const { email, password } = credentials;
            const user = await DatabaseService.findOne('users', { where: { email } });
            if (!user) {
                return {
                    success: false,
                    message: 'Invalid credentials'
                };
            }
            const isValidPassword = await bcrypt.compare(password, user.password_hash);
            if (!isValidPassword) {
                return {
                    success: false,
                    message: 'Invalid credentials'
                };
            }
            const token = jwt.sign({
                userId: user.id,
                email: user.email,
                role: user.role,
                iat: Math.floor(Date.now() / 1000)
            }, JWT_SECRET, {
                expiresIn: '24h',
                issuer: 'shared-wealth-international',
                audience: 'wealth-pioneers-users'
            });
            const session = {
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    created_at: user.created_at
                },
                access_token: token
            };
            return {
                success: true,
                data: session
            };
        }
        catch (error) {
            console.error('Sign in error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async signUp(userData) {
        try {
            const { email, password, firstName, lastName, phone, role, selectedCompanyId, position } = userData;
            const existingUser = await DatabaseService.findOne('users', { where: { email } });
            if (existingUser) {
                return {
                    success: false,
                    message: 'User already exists'
                };
            }
            const saltRounds = 12;
            const passwordHash = await bcrypt.hash(password, saltRounds);
            const newUser = await DatabaseService.insert('users', {
                email,
                password_hash: passwordHash,
                first_name: firstName,
                last_name: lastName,
                phone: phone,
                role: role || 'user'
            });
            if (selectedCompanyId) {
                try {
                    await DatabaseService.insert('user_companies', {
                        user_id: newUser.id,
                        company_id: selectedCompanyId,
                        role: position || 'member',
                        position: position || 'Member',
                        status: 'active',
                        is_primary: true
                    });
                    console.log('✅ User-company relationship created successfully');
                }
                catch (error) {
                    console.error('Error creating user-company relationship:', error);
                }
            }
            const token = jwt.sign({ userId: newUser.id, email: newUser.email, role: newUser.role }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });
            return {
                success: true,
                data: { userId: newUser.id, token },
                message: 'User created successfully'
            };
        }
        catch (error) {
            console.error('Sign up error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async signOut(userId) {
        try {
            return {
                success: true,
                data: { message: 'Signed out successfully' }
            };
        }
        catch (error) {
            console.error('Sign out error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async resetPassword(email) {
        try {
            const user = await DatabaseService.findOne('users', { where: { email } });
            if (!user) {
                return {
                    success: true,
                    data: { message: 'Password reset email sent' }
                };
            }
            return {
                success: true,
                data: { message: 'Password reset email sent' }
            };
        }
        catch (error) {
            console.error('Reset password error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async isAdmin(userId) {
        try {
            const user = await DatabaseService.findOne('users', { where: { id: userId } });
            if (!user) {
                return {
                    success: false,
                    message: 'User not found'
                };
            }
            const isAdmin = user.role === 'admin' || user.role === 'superadmin';
            return {
                success: true,
                data: { isAdmin }
            };
        }
        catch (error) {
            console.error('Admin check error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async isSuperAdmin(userId) {
        try {
            const user = await DatabaseService.findOne('users', { where: { id: userId } });
            if (!user) {
                return {
                    success: false,
                    message: 'User not found'
                };
            }
            const isSuperAdmin = user.role === 'superadmin';
            return {
                success: true,
                data: { isSuperAdmin }
            };
        }
        catch (error) {
            console.error('Super admin check error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
    static async getUserById(userId) {
        try {
            const user = await DatabaseService.findOne('users', { where: { id: userId } });
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
    static async updateUser(userId, updateData) {
        try {
            const { password_hash, ...safeUpdateData } = updateData;
            const updatedUser = await DatabaseService.update('users', userId, safeUpdateData);
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
    static async changePassword(userId, currentPassword, newPassword) {
        try {
            const user = await DatabaseService.findOne('users', { where: { id: userId } });
            if (!user) {
                return {
                    success: false,
                    message: 'User not found'
                };
            }
            const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
            if (!isValidPassword) {
                return {
                    success: false,
                    message: 'Current password is incorrect'
                };
            }
            const saltRounds = 12;
            const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);
            await DatabaseService.update('users', userId, { password_hash: newPasswordHash });
            return {
                success: true,
                data: { message: 'Password changed successfully' }
            };
        }
        catch (error) {
            console.error('Change password error:', error);
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
}
//# sourceMappingURL=authService.js.map