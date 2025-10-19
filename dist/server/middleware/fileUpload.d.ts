import multer from 'multer';
import { Request } from 'express';
export declare const upload: multer.Multer;
export declare const uploadLogo: multer.Multer;
export declare const uploadDocument: multer.Multer;
export declare const uploadImage: multer.Multer;
export declare const handleUploadError: (error: any, req: Request, res: any, next: any) => any;
export declare const validateFile: (file: Express.Multer.File, uploadType?: string) => boolean;
export declare const cleanupOldFiles: (daysOld?: number) => Promise<void>;
export default upload;
//# sourceMappingURL=fileUpload.d.ts.map