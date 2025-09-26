import { Request, Response } from 'express';
export declare class UnifiedContentController {
    static getAllContent(req: Request, res: Response): Promise<void>;
    static getContentById(req: Request, res: Response): Promise<void>;
    static createContent(req: Request, res: Response): Promise<void>;
    static updateContent(req: Request, res: Response): Promise<void>;
    static deleteContent(req: Request, res: Response): Promise<void>;
    static getContentByCompany(req: Request, res: Response): Promise<void>;
    static getContentByUser(req: Request, res: Response): Promise<void>;
    static togglePublishStatus(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=unifiedContentController.d.ts.map