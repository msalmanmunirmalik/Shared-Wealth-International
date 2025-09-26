import { Request, Response } from 'express';
export declare class CompanyController {
    static getCompanies(req: Request, res: Response): Promise<void>;
    static getCompanyById(req: Request, res: Response): Promise<void>;
    static createCompany(req: Request, res: Response): Promise<void>;
    static getUserCompanies(req: Request, res: Response): Promise<void>;
    static getUserApplications(req: Request, res: Response): Promise<void>;
    static updateCompany(req: Request, res: Response): Promise<void>;
    static deleteCompany(req: Request, res: Response): Promise<void>;
    static getCompaniesByStatus(req: Request, res: Response): Promise<void>;
    static searchCompanies(req: Request, res: Response): Promise<void>;
    static getCompanyStats(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=companyController.d.ts.map