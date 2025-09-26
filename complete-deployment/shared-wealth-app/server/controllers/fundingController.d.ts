import { Request, Response } from 'express';
export declare class FundingController {
    static createFundingApplication(req: Request, res: Response): Promise<void>;
    static updateFundingApplication(req: Request, res: Response): Promise<void>;
    static getFundingApplications(req: Request, res: Response): Promise<void>;
    static getFundingApplicationById(req: Request, res: Response): Promise<void>;
    static approveFundingApplication(req: Request, res: Response): Promise<void>;
    static rejectFundingApplication(req: Request, res: Response): Promise<void>;
    static deleteFundingApplication(req: Request, res: Response): Promise<void>;
    static getFundingOpportunitiesWithStats(req: Request, res: Response): Promise<void>;
    static getFundingAnalytics(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=fundingController.d.ts.map