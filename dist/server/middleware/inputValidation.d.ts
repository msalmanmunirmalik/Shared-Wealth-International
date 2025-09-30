import { Request, Response, NextFunction } from 'express';
import { ValidationChain } from 'express-validator';
declare global {
    namespace Express {
        interface Request {
            sanitizedBody?: any;
            sanitizedQuery?: any;
            sanitizedParams?: any;
        }
    }
}
export declare class InputValidation {
    static sanitizeHtml: (input: any) => any;
    static escapeSql: (input: string) => string;
    static sanitizeRequest: (req: Request, res: Response, next: NextFunction) => void;
    static handleValidationErrors: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    static customRules: {
        email: (field?: string) => ValidationChain;
        password: (field?: string, minLength?: number) => ValidationChain;
        companyName: (field?: string) => ValidationChain;
        url: (field?: string) => ValidationChain;
        uuid: (field: string) => ValidationChain;
        pagination: () => ValidationChain[];
        searchQuery: (field?: string) => ValidationChain;
        fileUpload: (field?: string) => ValidationChain;
    };
    static sensitiveOperationRateLimit: (req: Request, res: Response, next: NextFunction) => void;
    static validateRequestSize: (maxSize?: number) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    static routeValidators: {
        signin: (ValidationChain | ((req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined))[];
        signup: (ValidationChain | ((req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined))[];
        createCompany: (ValidationChain | ((req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined))[];
        updateProfile: (ValidationChain | ((req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined))[];
        uuidParam: (paramName?: string) => (ValidationChain | ((req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined))[];
        pagination: (ValidationChain | ((req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined))[];
        search: (ValidationChain | ((req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined))[];
    };
}
export default InputValidation;
//# sourceMappingURL=inputValidation.d.ts.map