import { User, Session, SignInRequest, ApiResponse } from '../types/index.js';
export declare class AuthService {
    static signIn(credentials: SignInRequest): Promise<ApiResponse<Session>>;
    static signUp(userData: any): Promise<ApiResponse<{
        userId: string;
        token?: string;
    }>>;
    static signOut(userId: string): Promise<ApiResponse<{
        message: string;
    }>>;
    static resetPassword(email: string): Promise<ApiResponse<{
        message: string;
    }>>;
    static isAdmin(userId: string): Promise<ApiResponse<{
        isAdmin: boolean;
    }>>;
    static isSuperAdmin(userId: string): Promise<ApiResponse<{
        isSuperAdmin: boolean;
    }>>;
    static getUserById(userId: string): Promise<ApiResponse<User>>;
    static updateUser(userId: string, updateData: Partial<User>): Promise<ApiResponse<User>>;
    static changePassword(userId: string, currentPassword: string, newPassword: string): Promise<ApiResponse<{
        message: string;
    }>>;
}
//# sourceMappingURL=authService.d.ts.map