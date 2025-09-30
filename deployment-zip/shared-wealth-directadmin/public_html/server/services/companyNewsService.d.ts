import { ApiResponse } from '../types/api.js';
export declare class CompanyNewsService {
    static getAllCompanyNews(limit?: number, offset?: number): Promise<ApiResponse<any[]>>;
    static getCompanyNews(companyId: string): Promise<ApiResponse<any[]>>;
    static createCompanyPost(companyId: string, userId: string, postData: any): Promise<ApiResponse<any>>;
    static updateCompanyPost(companyId: string, postId: string, userId: string, updateData: any): Promise<ApiResponse<any>>;
    static deleteCompanyPost(companyId: string, postId: string, userId: string): Promise<ApiResponse<any>>;
}
//# sourceMappingURL=companyNewsService.d.ts.map