import { ApiResponse } from '../types/api.js';
export interface FileData {
    originalName: string;
    filename: string;
    mimetype: string;
    size: number;
    path: string;
    context: string;
    contextId?: string;
    description?: string;
    tags?: string[];
    uploadedBy: string;
}
export interface FileFilters {
    limit?: number;
    offset?: number;
    type?: string;
    search?: string;
}
export interface FileShareData {
    shareType: string;
    recipients?: string[];
    message?: string;
    expiresAt?: string;
}
export interface FileUpdateData {
    description?: string;
    tags?: string[];
    isPublic?: boolean;
}
export declare class UnifiedFileService {
    static uploadFile(fileData: FileData): Promise<ApiResponse<any>>;
    static getFile(fileId: string, userId: string): Promise<ApiResponse<any>>;
    static getFilesByContext(context: string, contextId: string, filters: FileFilters, userId: string): Promise<ApiResponse<any[]>>;
    static getUserFiles(userId: string, filters: FileFilters): Promise<ApiResponse<any[]>>;
    static updateFile(fileId: string, updateData: FileUpdateData, userId: string): Promise<ApiResponse<any>>;
    static deleteFile(fileId: string, userId: string): Promise<ApiResponse<boolean>>;
    static shareFile(fileId: string, shareData: FileShareData, userId: string): Promise<ApiResponse<any>>;
    static getFileShares(fileId: string, userId: string): Promise<ApiResponse<any[]>>;
    static getFileAnalytics(fileId: string, userId: string): Promise<ApiResponse<any>>;
    static getStorageStats(userId: string): Promise<ApiResponse<any>>;
    static incrementDownloadCount(fileId: string): Promise<ApiResponse<boolean>>;
    static incrementViewCount(fileId: string): Promise<ApiResponse<boolean>>;
    private static checkFileAccess;
    static getFileTypeCategory(mimetype: string): string;
    static getFileIcon(mimetype: string): string;
}
//# sourceMappingURL=unifiedFileService.d.ts.map