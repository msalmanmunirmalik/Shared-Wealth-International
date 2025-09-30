import { Company, CreateCompanyRequest, ApiResponse, PaginationParams, PaginatedResponse } from '../types/index.js';
export declare class CompanyService {
    static getCompanies(pagination?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Company> | Company[]>>;
    static getCompanyById(id: string): Promise<ApiResponse<Company>>;
    static createCompany(companyData: CreateCompanyRequest, userId: string): Promise<ApiResponse<Company>>;
    static updateCompany(id: string, updateData: Partial<Company>): Promise<ApiResponse<Company>>;
    static getUserCompanies(userId: string): Promise<ApiResponse<Company[]>>;
    static getUserApplications(userId: string): Promise<ApiResponse<any[]>>;
    static deleteCompany(id: string): Promise<ApiResponse<{
        message: string;
    }>>;
    static getCompaniesByStatus(isActive: boolean): Promise<ApiResponse<Company[]>>;
    static searchCompanies(query: string, category?: string): Promise<ApiResponse<Company[]>>;
    static getCompanyStats(): Promise<ApiResponse<{
        total: number;
        active: number;
        inactive: number;
        verified: number;
        unverified: number;
    }>>;
}
//# sourceMappingURL=companyService.d.ts.map