import { Request, Response } from 'express';
export declare class ContentController {
    static createFundingOpportunity(req: Request, res: Response): Promise<void>;
    static updateFundingOpportunity(req: Request, res: Response): Promise<void>;
    static deleteFundingOpportunity(req: Request, res: Response): Promise<void>;
    static getFundingOpportunities(req: Request, res: Response): Promise<void>;
    static createNewsArticle(req: Request, res: Response): Promise<void>;
    static updateNewsArticle(req: Request, res: Response): Promise<void>;
    static deleteNewsArticle(req: Request, res: Response): Promise<void>;
    static getNewsArticles(req: Request, res: Response): Promise<void>;
    static createEvent(req: Request, res: Response): Promise<void>;
    static updateEvent(req: Request, res: Response): Promise<void>;
    static deleteEvent(req: Request, res: Response): Promise<void>;
    static getEvents(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=contentController.d.ts.map