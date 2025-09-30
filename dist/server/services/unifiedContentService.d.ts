import { ApiResponse } from '../types/api.js';
export interface ContentFilters {
    type?: string;
    author_id?: string;
    company_id?: string;
    is_published?: boolean;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
}
export interface ContentData {
    title: string;
    content: string;
    type: string;
    company_id?: string;
    tags?: string[];
    media_urls?: string[];
    is_published?: boolean;
    metadata?: Record<string, any>;
}
export declare class UnifiedContentService {
    static getAllContent(filters: ContentFilters): Promise<ApiResponse<any[]>>;
    static getContentById(id: string): Promise<ApiResponse<any>>;
    static createContent(userId: string, contentData: ContentData): Promise<ApiResponse<any>>;
    static updateContent(id: string, userId: string, updateData: Partial<ContentData>): Promise<ApiResponse<any>>;
    static deleteContent(id: string, userId: string): Promise<ApiResponse<any>>;
    static getContentByCompany(filters: ContentFilters): Promise<ApiResponse<any[]>>;
    static getContentByUser(filters: ContentFilters): Promise<ApiResponse<any[]>>;
    static togglePublishStatus(id: string, userId: string, isPublished: boolean): Promise<ApiResponse<any>>;
}
//# sourceMappingURL=unifiedContentService.d.ts.map