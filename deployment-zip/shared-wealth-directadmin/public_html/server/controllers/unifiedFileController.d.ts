import { Request, Response } from 'express';
import multer from 'multer';
declare const upload: multer.Multer;
export declare class UnifiedFileController {
    static uploadFile(req: Request, res: Response): Promise<void>;
    static uploadMultipleFiles(req: Request, res: Response): Promise<void>;
    static getFile(req: Request, res: Response): Promise<void>;
    static downloadFile(req: Request, res: Response): Promise<void>;
    static getFilesByContext(req: Request, res: Response): Promise<void>;
    static getUserFiles(req: Request, res: Response): Promise<void>;
    static updateFile(req: Request, res: Response): Promise<void>;
    static deleteFile(req: Request, res: Response): Promise<void>;
    static shareFile(req: Request, res: Response): Promise<void>;
    static getFileShares(req: Request, res: Response): Promise<void>;
    static getFileAnalytics(req: Request, res: Response): Promise<void>;
    static getStorageStats(req: Request, res: Response): Promise<void>;
}
export { upload };
//# sourceMappingURL=unifiedFileController.d.ts.map