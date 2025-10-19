import { ApiResponse } from '../types/api.js';
export interface UserRegistrationData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
}
export interface UserProfileData {
    firstName?: string;
    lastName?: string;
    bio?: string;
    avatar?: string;
    preferences?: any;
}
export interface UserUpdateData {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    status?: string;
    bio?: string;
    avatar?: string;
}
export interface UserFilters {
    limit?: number;
    offset?: number;
    search?: string;
    role?: string;
    status?: string;
}
export interface UserActivityFilters {
    limit?: number;
    offset?: number;
    type?: string;
}
export declare class UnifiedUserService {
    static register(userData: UserRegistrationData): Promise<ApiResponse<any>>;
    static login(email: string, password: string): Promise<ApiResponse<any>>;
    static logout(userId: string): Promise<ApiResponse<boolean>>;
    static getUserProfile(userId: string): Promise<ApiResponse<any>>;
    static updateUserProfile(userId: string, profileData: UserProfileData): Promise<ApiResponse<any>>;
    static changePassword(userId: string, currentPassword: string, newPassword: string): Promise<ApiResponse<boolean>>;
    static getAllUsers(filters: UserFilters): Promise<ApiResponse<any[]>>;
    static updateUser(userId: string, updateData: UserUpdateData): Promise<ApiResponse<any>>;
    static deleteUser(userId: string): Promise<ApiResponse<boolean>>;
    static getUserStats(userId: string): Promise<ApiResponse<any>>;
    static getUserActivity(userId: string, filters: UserActivityFilters): Promise<ApiResponse<any[]>>;
    static verifyEmail(token: string): Promise<ApiResponse<boolean>>;
    static requestPasswordReset(email: string): Promise<ApiResponse<boolean>>;
    static resetPassword(token: string, newPassword: string): Promise<ApiResponse<boolean>>;
    static checkAdminAccess(userId: string): Promise<boolean>;
}
//# sourceMappingURL=unifiedUserService.d.ts.map