import { ApiResponse } from '../types/index.js';
export declare class NetworkService {
    static getUserNetwork(userId: string): Promise<ApiResponse<any[]>>;
    static addToNetwork(userId: string, companyId: string, connectionType?: string, notes?: string): Promise<ApiResponse<any>>;
    static removeFromNetwork(userId: string, companyId: string): Promise<ApiResponse<any>>;
    static getAvailableCompanies(userId: string, searchTerm?: string): Promise<ApiResponse<any[]>>;
}
//# sourceMappingURL=networkService.d.ts.map