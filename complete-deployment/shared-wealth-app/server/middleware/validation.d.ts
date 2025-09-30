import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/index.js';
export declare const handleValidationErrors: (req: Request, res: Response<ApiResponse>, next: NextFunction) => void;
export declare const authValidation: {
    signIn: import("express-validator").ValidationChain[];
    signUp: import("express-validator").ValidationChain[];
    resetPassword: import("express-validator").ValidationChain[];
};
export declare const companyValidation: {
    create: import("express-validator").ValidationChain[];
    update: import("express-validator").ValidationChain[];
    getById: import("express-validator").ValidationChain[];
};
export declare const userValidation: {
    getById: import("express-validator").ValidationChain[];
    update: import("express-validator").ValidationChain[];
};
export declare const paginationValidation: import("express-validator").ValidationChain[];
export declare const searchValidation: import("express-validator").ValidationChain[];
export declare const fileUploadValidation: import("express-validator").ValidationChain[];
//# sourceMappingURL=validation.d.ts.map